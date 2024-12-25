import { SetupProgressType } from "../../types/setup";
import { useIonAlert, useIonRouter } from "@ionic/react";
import useSession from "../auth/useSession";
import { useState, useEffect } from "react";
import { useSteps } from "../useSteps";
import { useHistory } from "react-router";
import { AcademicYearType, ClassType, CourseType } from "../../types";
import client from "../../client";
import { useAtom } from "jotai";
import { newStudentAtom } from "../../atoms/student";
import dayjs from "dayjs";
import useSelfStudentLite from "../me/useSelfStudentLite";

export default function useSetup() {
  const [progress, setProgress] = useState<SetupProgressType["progress"]>([
    { Intro: false },
    { StudentOrProf: false },
    { PdfOrManual: false },
    { AcademicInformation: false },
    { Subjects: false },
  ]);

  const stepHookParts = useSteps(4);
  const rt = useIonRouter();
  const history = useHistory();
  const { session } = useSession();

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        console.log("POP");
        stepHookParts.goToPrevStep();
      }
    });
    return () => {
      unlisten();
    };
  }, [history, stepHookParts]);

  const [newStudent, setNewStudent] = useAtom(newStudentAtom);

  const checkProgress = async () => {
    // calls the edge function to check the progress of the user

    // check if there's a student
    const { data, error } = await client
      .from("profiles")
      .select("*, student:students(*)")
      .eq("id", session!.user.id)
      .single();

    if (error || data === null) {
      setProgress([
        { Intro: false },
        { StudentOrProf: false },
        { PdfOrManual: false },
        { AcademicInformation: false },
        { Subjects: false },
      ]);
    }

    if (data?.student !== undefined) {
      setProgress([
        { Intro: true },
        { StudentOrProf: true },
        { PdfOrManual: true },
        { AcademicInformation: true },
        { Subjects: false },
      ]);
    }

    // check if there are added classes
    const { data: classes, error: classesError } = await client
      .from("classes")
      .select("*")
      .eq("student_id", data?.student[0].id!);

    if (classesError || classes === null) {
      setProgress([
        { Intro: true },
        { StudentOrProf: true },
        { PdfOrManual: true },
        { AcademicInformation: true },
        { Subjects: false },
      ]);
    } else {
      setProgress([
        { Intro: true },
        { StudentOrProf: true },
        { PdfOrManual: true },
        { AcademicInformation: true },
        { Subjects: true },
      ]);
    }
  };

  const createStudent = async (props: {
    studentNo: string;
    fullName: string;
    course: CourseType;
    yearLevel: number;
    academicYear: AcademicYearType;
    isRegular: boolean;
  }) => {
    // const { error } = await client
    //   .from("students")
    //   .insert({
    //     school: 1 // default school: Adamson University
    //     student
    //   });
  };

  const handleUpdateAcademicInformation = async (info: {
    fullName: string | null;
    course: CourseType | null;
    yearLevel: number | null;
    isRegular: boolean | null;
  }) => {
    // console.log(info);
    // const { error } = await client
    //   .from("")
  };

  const handleNext = () => {
    // TODO: Let's make this dynamic by examining the data that we have in the progress state
    // and push the next route based on that
    console.log("handleNext");
    console.log(rt.routeInfo.pathname);

    // get current query params
    const currentParams = window.location.search;

    switch (rt.routeInfo.pathname) {
      case "/setup":
        rt.push("/setup/studentOrProf"+currentParams);
        break;
      case "/setup/studentOrProf":
        rt.push("/setup/pdfUpload"+currentParams);
        break;
      case "/setup/pdfUpload":
        rt.push("/setup/introduceYourself"+currentParams);
        break;
      case "/setup/introduceYourself":
        rt.push("/setup/academicInformation"+currentParams);
        break;
      case "/setup/academicInformation":
        rt.push("/setup/classes"+currentParams);
        break;
      case "/setup/classes":
        rt.push("/setup/hobbies"+currentParams);
        break;
      case "/setup/hobbies":
        rt.push("/setup/finish"+currentParams);
        break;
    }
  };

  const handlePrev = () => {
    if (stepHookParts.currentStep > 0) {
      stepHookParts.goToPrevStep();
    }
  };

  const [uploading, setUploading] = useState(false);
  const [showAlert] = useIonAlert();
  const handleUpload = async () => {
    setUploading(() => true);

    // upload the student information
    const { data, error } = await client
      .from("students")
      .insert({
        academic_year_id: newStudent.step2.academicYear!,
        course: newStudent.step2.course!,
        description: newStudent.step1.description!,
        full_name: newStudent.step1.fullName!,
        profile_id: session!.user.id!,
        school: 1,
        school_email: session!.user.email!,
        student_no: newStudent.step2.studentNo! + "",
        type: newStudent.step2.type ? "regular" : "irregular",
        block: newStudent.step2.block!,
        verified: true,
        year_level: newStudent.step2.yearLevel!,
      })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      setUploading(() => false);
      showAlert({
        header: "Error",
        message:
          "An error occurred while uploading your information. Please try again. \n\n" +
          error.message,
        buttons: ["OK"],
      });
      return;
    }

    const classesRaw = newStudent.step3.classes;
    // create the classes object needed by supabase
    const classes = classesRaw.map((c) => {
      return {
        student_id: data.id,
        subject_id: c.subjectId,
        start_time: dayjs(c.startTime).format("HH:mm:ss"),
        end_time: dayjs(c.endTime).format("HH:mm:ss"),
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
    console.log(classes);

    // upload the classes
    const { data: classesData, error: classesError } = await client
      .from("classes")
      .insert(classes)
      .select("*");
    console.log("added classes to db: ", classesData);

    if (classesError) {
      console.error(error);
      setUploading(() => false);

      // since there is an error, we should delete the student that we just created
      const { error: deleteError } = await client
        .from("students")
        .delete()
        .eq("id", data.id);

      showAlert({
        header: "Error",
        message:
          "An error occurred while uploading your classes. Please try again. \n\n" +
          classesError.message,
        buttons: ["OK"],
      });
      return;
    }

    // create the raw subjects object needed by supabase
    const subjects = classesRaw.map((c, index) => {
      return {
        student_id: data.id,
        subject_id: c.subjectId,
        order: index+1,
      }
    })
    console.log("subjects: ", subjects);

    // upload the subjects
    const { data: subjectsData, error: subjectsError } = await client
      .from("students_subjects")
      .insert(subjects)
      .select("*");
    console.log("added subjects to db: ", subjectsData);

    if (subjectsError) {
      console.error(error);
      setUploading(() => false);

      // since there is an error, we should delete the subjects that we just created
      const { error: deleteError } = await client
        .from("students")
        .delete()
        .in("id", [data.id]);

      showAlert({
        header: "Error",
        message:
          "An error occurred while uploading your subjects. Please try again. \n\n" +
          subjectsError.message,
        buttons: ["OK"],
      });
      return;
    }

    setUploading(() => false);

    // go to the finish page
    // rt.push("/setup/finish");
  };

  const { student, query: selfStudentQuery } = useSelfStudentLite();
  const handleUploadInterests = async (hobbyIds: number[]) => {
    setUploading(() => true);

    // refresh the student data
    selfStudentQuery.refetch();

    // get the student id
    const studentId = student!.id;

    // create an object for each hobbyId
    const hobbies = hobbyIds.map((hobby
      : number) => ({
        student_id: studentId,
        hobby_id: hobby,
        is_custom: false,
      }))

    // delete the existing hobbies for the student
    const { error: deleteError } = await client.from('student_hobbies').delete().eq('student_id', studentId);

    if (deleteError) {
      console.error(deleteError);
      showAlert({
        header: "Error",
        message:
          "An error occurred while uploading your interests. Please try again. \n\n" +
          deleteError.message,
        buttons: ["OK"],
      });
      return;
    }

    // create the relationship between the student and the hobbies
    const { error } = await client.from('student_hobbies').insert([...hobbies]);

    if (error) {
      console.error(error);
      showAlert({
        header: "Error",
        message:
          "An error occurred while uploading your interests. Please try again. \n\n" +
          error.message,
        buttons: ["OK"],
      });
      return;
    }

    setUploading(() => false);

    // go to the finish page
    await handleFinish();
  }

  async function handleFinish() {
    // go to the finish page
    await rt.push("/setup/finish");
  }

  return {
    progress,
    checkProgress,
    ...stepHookParts,
    handlePrev,
    handleNext,
    handleUpload,
    handleUploadInterests,
    handleFinish,
    uploading,
  };
}
