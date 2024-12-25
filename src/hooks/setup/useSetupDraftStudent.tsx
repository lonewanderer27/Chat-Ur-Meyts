import md5 from 'md5';
import client from '../../client'
import { NewStudentTypeSteps } from '../../types/student/post/NewStudentType'
import Image from 'image-js';
import { StudentRegType } from '../../types';
import dayjs from 'dayjs';
import { useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import useFeatureFlags from '../useFeatureFlags';
import useSelfStudentLite from '../me/useSelfStudentLite';
import { useAtomValue } from 'jotai';
import { newStudentAtom } from '../../atoms/student';
import useSession from '../auth/useSession';

const useSetupDraftStudent = () => {
  const [enableUploadProgress, setEnableUploadProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const rt = useIonRouter();
  const { session } = useSession();
  const { flags } = useFeatureFlags();

  const [steps, setSteps] = useState<string[]>([
    "/setup",
    // "/setup/studentOrProf",
    "/setup/pdfUpload",
    "/setup/introduceYourself",
    "/setup/academicInformation",
    "/setup/classes",
    "/setup/hobbies",
    "/setup/finish"
  ]);

  // const isStudentOrProfDisabled = (flags["disable_setup_student_or_prof"]?.value as unknown as boolean) ?? false;

  // useEffect(() => {
  //   if (flags) {
  //     if (!isStudentOrProfDisabled) {
  //       setSteps(steps.filter(step => step !== "/setup/studentOrProf"));
  //     }
  //   }

  //   // console.log("Updated Steps: ", steps);
  // }, [flags])

  // Removes trailing slashes from a path
  const normalizePath = (path: string) => path.replace(/\/+$/, "");

  const handleNext = async () => {
    console.log("next step in draft student setup");

    // Get current query params
    const currentParams = window.location.search;

    // Normalize the current path and steps for comparison
    const currentPath = normalizePath(rt.routeInfo.pathname);
    const normalizedSteps = steps.map(normalizePath);

    // Find the current step index
    const currentIndex = normalizedSteps.indexOf(currentPath);

    // Check if there's a next step
    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      const nextPath = steps[currentIndex + 1] + currentParams;
      rt.push(nextPath);
    } else {
      console.error("No next step found or end of sequence reached");
    }
  }

  const handleNewDraftStudent = async () => {
    const newDraftStudent = await client
      .from("draft_students")
      .insert({
        user_id: session?.user.id!,
        completed: false,
        school_email: (await client.auth.getUser()).data.user?.email,
      })
      .select("*")
      .single()

    if (newDraftStudent.error) {
      console.error(newDraftStudent.error)
      throw new Error(newDraftStudent.error.message)
    }

    return newDraftStudent.data;
  }

  const handleDraftCOEUpload = async (COEImage: Image, sessionId: string) => {
    const coeHash = await md5(COEImage.toBuffer())
    console.log("MD5 Hash of COE Image: ", coeHash)

    const storagePath = `users/${session?.user.id!}/${coeHash}.png`

    const coeBlob = await COEImage.toBlob()

    const coeUpload = await client
      .storage.from("coe_scans")
      .upload(storagePath, coeBlob, {
        upsert: true,
        contentType: "image/png",
      })

    if (coeUpload.error) {
      console.error(coeUpload.error)
      throw new Error(coeUpload.error.message)
    }

    const updatedDraftStudent = await client
      .from("draft_students")
      .update({
        coe_file_path: storagePath,
      })
      .eq("id", sessionId)
      .select("*")
      .single()

    if (updatedDraftStudent.error) {
      console.error(updatedDraftStudent.error)
      throw new Error(updatedDraftStudent.error.message)
    }

    return updatedDraftStudent.data;
  }

  const handleDraftIntroduceYourself = async (data: {
    full_name: string,
    description?: string
  }, sessionId: string) => {
    const updatedDraftStudent = await client
      .from("draft_students")
      .update(data)
      .eq("id", sessionId)
      .select("*")
      .single()

    if (updatedDraftStudent.error) {
      console.error(updatedDraftStudent.error)
      throw new Error(updatedDraftStudent.error.message)
    }

    return updatedDraftStudent.data;
  }

  const handleDraftAcademicInfo = async (data: {
    student_no: string,
    course_id: number,
    year_level: number,
    academic_year_id: number,
    type: StudentRegType,
    block?: string
  }, sessionId: string) => {
    const updatedDraftStudent = await client
      .from("draft_students")
      .update({
        student_no: data.student_no,
        course_id: data.course_id,
        year_level: data.year_level,
        academic_year_id: data.academic_year_id,
        type: data.type,
        block: data.type === "regular" ? data.block?.replace(" ", "") : "Irregular",
      })
      .eq("id", sessionId)
      .select("*")
      .single()

    if (updatedDraftStudent.error) {
      console.error(updatedDraftStudent.error)
      throw new Error(updatedDraftStudent.error.message)
    }

    return updatedDraftStudent.data;
  }

  const handleDraftClasses = async (data: {
    classes: {
      subjectId: number,
      room?: string,
      monday?: boolean,
      tuesday?: boolean,
      wednesday?: boolean,
      thursday?: boolean,
      friday?: boolean,
      saturday?: boolean,
      sunday?: boolean,
      startTime?: string,
      endTime?: string,
    }[]
  }, sessionId: string) => {
    setUploading(() => true);

    // Remove the existing draft classes
    const { data: deleteData, error: deleteError } = await client
      .from("draft_classes")
      .delete()
      .eq("draft_student_id", sessionId)
      .select("*");

    if (deleteError) {
      console.error(deleteError);
      setUploading(() => false);
      throw new Error(deleteError.message);
    }

    // create the classes object needed by supabase
    const classObjs = data.classes.map((c) => {
      return {
        draft_student_id: sessionId,
        subject_id: c.subjectId,
        start_time: dayjs(c.startTime).isValid() ? dayjs(c.startTime).format("HH:mm:ss") : undefined,
        end_time: dayjs(c.endTime).isValid() ? dayjs(c.endTime).format("HH:mm:ss") : undefined,
        room: c.room,
        monday: c.monday,
        tuesday: c.tuesday,
        wednesday: c.wednesday,
        thursday: c.thursday,
        friday: c.friday,
        saturday: c.saturday,
        sunday: c.sunday,
      };
    });
    console.log(classObjs);

    // upload the classes to draft_classes
    const { data: classesData, error: classesError } = await client
      .from("draft_classes")
      .insert(classObjs)
      .select("*");
    console.log("added draft classes to db: ", classesData);

    if (classesError) {
      console.error(classesError);
      setUploading(() => false);
      throw new Error(classesError.message);
    }

    setUploading(() => false);
    return classesData;
  }

  const handleDraftHobbies = async (
    data: NewStudentTypeSteps["step4"],
    sessionId: string,
    customHobbies: {
      id: number;
      title: string;
      selected: boolean;
    }[]
  ) => {
    setUploading(() => true);

    // Remove the existing draft hobbies
    const { data: deleteData, error: deleteError } = await client
      .from("draft_student_hobbies")
      .delete()
      .eq("draft_student_id", sessionId)
      .select("*")

    if (deleteError) {
      console.error(deleteError)
      setUploading(() => false)
      throw new Error(deleteError.message)
    }

    // Upload the custom hobbies to the real hobbies table
    const customHobbiesData = customHobbies.map((hobby) => ({
      title: hobby.title,
      is_custom: true,
      // created_by_student_id: // TODO: Figure out later
    }))

    const { data: customHobbiesRes, error: customHobbiesError } = await client
      .from("hobbies")
      .insert(customHobbiesData)
      .select("*")

    if (customHobbiesError) {
      console.error(customHobbiesError)
      setUploading(() => false)
      throw new Error(customHobbiesError.message)
    }

    // create the hobbies object needed by supabase
    const customHbbys = customHobbiesRes.map((hobby) => ({
      draft_student_id: sessionId,
      hobby_id: hobby.id
    }))

    const hobbies = data.hobbies.map((hobby
      : number) => ({
        draft_student_id: sessionId,
        hobby_id: hobby
      }))

    // append the custom hobbies to the hobbies array
    hobbies.push(...customHbbys);

    const { data: hobbiesData, error: hobbiesError } = await client
      .from("draft_student_hobbies")
      .insert(hobbies)
      .select("*")

    if (hobbiesError) {
      console.error(hobbiesError)
      setUploading(() => false)
      throw new Error(hobbiesError.message)
    }

    setUploading(() => false)
    return hobbiesData;
  }

  const newStudent = useAtomValue(newStudentAtom);
  const studentQuery = useSelfStudentLite();

  const simulateCompleteStudent = async () => {
    console.log("Simulating student completion...");

    const loadingSteps = [
      { message: "Marking student as complete...", progress: 0.1, delay: 300 },
      { message: "Creating student profile...", progress: 0.2, delay: 1200 },
      { message: "Updating student data...", progress: 0.4, delay: 1500 },
      { message: "Refetching student data...", progress: 0.5, delay: 800 },
      { message: "Uploading COE Record...", progress: 0.6, delay: 2000 },
      { message: "Uploading Class Schedule...", progress: 0.75, delay: 1800 },
      { message: "Uploading Subjects...", progress: 0.85, delay: 1300 },
      { message: "Uploading Hobbies...", progress: 95, delay: 1000 },
      { message: "Finishing up...", progress: 1, delay: 500 },
    ];

    setUploading(true);
    setUploadProgress(0);
    setLoadingMsg("");

    for (const step of loadingSteps) {
      console.log("Running step:", step.message);

      setLoadingMsg(step.message);
      setUploadProgress(step.progress);

      // Wait for the specified delay before moving to the next step
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    setLoadingMsg("All done!");
    setUploading(false);
  };

  const handleCompleteStudent = async (sessionId: string) => {
    setEnableUploadProgress(() => true);
    setUploadProgress(() => 0);  // Initialize progress to 0
    setUploading(() => true);

    // mark the draft student as complete
    const draftStudent = await client
      .from("draft_students")
      .update({
        completed: true,
      })
      .eq("id", sessionId)
      .select("*")
      .single()

    if (draftStudent.error) {
      console.error(draftStudent.error)
      setUploading(() => false);
      throw new Error(draftStudent.error.message)
    }

    setUploadProgress(0.10); // Update progress to 10%

    setLoadingMsg("Creating student profile...");

    // check if there's an existing student
    const existingStudent = await client
      .from("students")
      .select("*")
      .eq("profile_id", session?.user.id!)
      .maybeSingle()

    console.log("Existing Student: ", existingStudent);

    setUploadProgress(0.20); // Update progress to 20%

    // Update or create student profile
    setLoadingMsg(existingStudent.data ? "Updating student data..." : "Creating student profile...");
    if (existingStudent.data !== null) {
      const updatedStudent = await client
        .from("students")
        .update({
          student_no: draftStudent.data.student_no,
          course: draftStudent.data.course_id,
          year_level: draftStudent.data.year_level,
          academic_year_id: draftStudent.data.academic_year_id,
          type: draftStudent.data.type,
          block: draftStudent.data.type === "regular" ? draftStudent.data.block?.replace(" ", "") : "Irregular",
          description: draftStudent.data.description,
          full_name: draftStudent.data.full_name,
          school_email: (await client.auth.getUser()).data.user?.email,
          updated_at: new Date().toISOString(),
          verified: true
        })
        .eq("id", existingStudent.data.id)

      if (updatedStudent.error) {
        console.error(updatedStudent.error)
        setUploading(() => false);
        throw new Error(updatedStudent.error.message)
      }
    } else {
      // if there is no existing student, create a new student
      const newStudent = await client
        .from("students")
        .insert({
          school: 1,
          student_no: draftStudent.data.student_no,
          profile_id: session?.user.id!,
          school_email: (await client.auth.getUser()).data.user?.email!,
          verified: true,
          academic_year_id: draftStudent.data.academic_year_id,
          description: draftStudent.data.description,
          full_name: draftStudent.data.full_name,
          type: draftStudent.data.type,
          course: draftStudent.data.course_id,
          year_level: draftStudent.data.year_level,
          block: draftStudent.data.type === "regular" ? draftStudent.data.block?.replace(" ", "") : "Irregular",
        })

      if (newStudent.error) {
        console.error(newStudent.error)
        setUploading(() => false);
        throw new Error(newStudent.error.message)
      }
    }

    setUploadProgress(0.40); // Update progress to 40%

    // refetch the student data
    const student = await studentQuery.query.refetch();

    setUploadProgress(0.50); // Update progress to 50%

    setLoadingMsg("Uploading COE Record...");

    // create new coe record
    const coe = await client
      .from("students_coe")
      .insert({
        student_id: student.data?.id!,
        file_path: draftStudent.data.coe_file_path!,
      })
      .select("*")
      .single()

    if (coe.error) {
      console.error(coe.error)
      setUploading(() => false);
      throw new Error(coe.error.message)
    }

    setUploadProgress(0.60); // Update progress to 60%

    // TODO: Fetch from the draft classes instead
    // const classesRaw = newStudent.step3.classes;
    const classesRes = await client
      .from("draft_classes")
      .select("*")
      .eq("draft_student_id", sessionId)

    if (classesRes.error) {
      console.error(classesRes.error)
      setUploading(() => false);
      throw new Error(classesRes.error.message)
    }

    const classesRaw = classesRes.data;

    // create the classes object needed by supabase
    const classObjs = classesRaw.map((c) => {
      return {
        student_id: student.data?.id!,
        subject_id: c.subject_id,
        start_time: dayjs(c.start_time).isValid() ? dayjs(c.start_time).format("HH:mm:ss") : undefined,
        end_time: dayjs(c.end_time).isValid() ? dayjs(c.end_time).format("HH:mm:ss") : undefined,
        room: c.room,
        monday: c.monday,
        tuesday: c.tuesday,
        wednesday: c.wednesday,
        thursday: c.thursday,
        friday: c.friday,
        saturday: c.saturday,
        sunday: c.sunday,
      };
    });
    console.log(classObjs);

    // upload the classes
    setLoadingMsg("Uploading Class Schedule...");
    const { data: classesData, error: classesError } = await client
      .from("classes")
      .insert(classObjs)
      .select("*");

    if (classesError) {
      console.error(classesError);
      setUploading(() => false);
      throw new Error(classesError.message);
    }

    setUploadProgress(0.75); // Update progress to 75%

    // create the raw subjects object needed by supabase
    const subjects = classesRaw.map((c, index) => ({
      student_id: student.data?.id!,
      subject_id: c.subject_id,
      order: index + 1,
    }));

    // upload the subjects
    setLoadingMsg("Uploading Subjects...");

    // delete the existing student subjects
    const { data: deleteSubjectsData, error: deleteSubjectsError } = await client
      .from("students_subjects")
      .delete()
      .eq("student_id", student.data?.id!)
      .select("*");

    if (deleteSubjectsError) {
      console.error(deleteSubjectsError);
      setUploading(() => false);
      throw new Error(deleteSubjectsError.message);
    }

    const { data: subjectsData, error: subjectsError } = await client
      .from("students_subjects")
      .insert(subjects)
      .select("*");

    if (subjectsError) {
      console.error(subjectsError);
      setUploading(() => false);
      throw new Error(subjectsError.message);
    }

    setUploadProgress(0.90); // Update progress to 90%

    const hobbiesRes = await client
      .from("draft_student_hobbies")
      .select("*")
      .eq("draft_student_id", sessionId)

    if (hobbiesRes.error) {
      console.error(hobbiesRes.error);
      setUploading(() => false);
      throw new Error(hobbiesRes.error.message);
    }

    const hobbiesRaw = hobbiesRes.data;

    // create the raw hobbies object needed by supabase
    const hobbies = hobbiesRaw.map((hobby) => ({
      student_id: student.data?.id!,
      hobby_id: hobby.hobby_id,
    }));

    // upload the hobbies
    setLoadingMsg("Uploading Hobbies...");

    // delete the existing student hobbies
    const { data: deleteHobbiesData, error: deleteHobbiesError } = await client
      .from("student_hobbies")
      .delete()
      .eq("student_id", student.data?.id!)
      .select("*");

    if (deleteHobbiesError) {
      console.error("Error deleting student hobbies: ", deleteHobbiesError);
      setUploading(() => false);
      throw new Error(deleteHobbiesError.message);
    }

    const { data: hobbiesData, error: hobbiesError } = await client
      .from("student_hobbies")
      .insert(hobbies)
      .select("*");

    if (hobbiesError) {
      console.error(hobbiesError);
      setUploading(() => false);
      throw new Error(hobbiesError.message);
    }

    setUploadProgress(100); // Update progress to 100%
    setLoadingMsg("Finishing up...");
    setUploading(() => false);
    return draftStudent.data;
  }

  return {
    uploading,
    setUploading,
    loadingMsg,
    setLoadingMsg,
    uploadProgress,
    setUploadProgress,
    handleNext,
    handleNewDraftStudent,
    handleDraftCOEUpload,
    handleDraftIntroduceYourself,
    handleDraftAcademicInfo,
    handleDraftClasses,
    handleDraftHobbies,
    handleCompleteStudent,
    simulateCompleteStudent,
  }
}

export default useSetupDraftStudent