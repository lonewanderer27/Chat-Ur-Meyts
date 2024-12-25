import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonRouter,
} from "@ionic/react";
import { number, object } from "yup";
import { NEW_GROUP } from "../../../constants/group";
import { NewGroupInputs } from "../../../types/group/NewGroup";
import { RouteComponentProps } from "react-router";
import client from "../../../client";
import { newGroupAtom } from "../../../atoms/group";
import { useAtom } from "jotai";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import useHideTabs from "../../../hooks/useHideTabs";
import useFetchAcademicYears from "../../../hooks/setup/useFetchAcademicYears";
import useFetchColleges from "../../../hooks/group/useFetchColleges";
import useFetchCourses from "../../../hooks/setup/useFetchCourses";
import useSelfStudentLite from "../../../hooks/me/useSelfStudentLite";

const CreateGroupP3: React.FC<RouteComponentProps> = ({ match }) => {
  useHideTabs();
  useHideTabs();

  const [show, dismiss] = useIonAlert();
  const { student } = useSelfStudentLite();
  const rt = useIonRouter();
  const validationSchema = object().shape({
    school: number().required("Must be a valid school"),
    college: number().required("Must be a valid college"),
    course: number().required("Must be a valid course"),
    semester: number().required("Must be a valid semester"),
    academic_year_id: number().required("Must be a valid academic year"),
  });
  const [creating, setCreating] = useState(() => false);
  const [newGroup, setNewGroup] = useAtom(newGroupAtom);

  const {
    register,
    handleSubmit,
    getFieldState,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm<NewGroupInputs["step3"]>({
    resolver: yupResolver(validationSchema),
    defaultValues: newGroup.step3,
  });

  // const collegesQry = useQuery({
  //   queryKey: ["colleges"],
  //   queryFn: async () => {
  //     const res = (await getAllColleges()).data;
  //     return res;
  //   },
  // });

  // const coursesQry = useQuery({
  //   queryKey: ["courses"],
  //   queryFn: async () => {
  //     const res = (await getAllCourses()).data;
  //     return res;
  //   },
  // });

  const handleNext: SubmitHandler<NewGroupInputs["step3"]> = async (data) => {
    setCreating(() => true);

    console.log("handleNext");
    console.log(data);

    // set group name and description in the atom
    setNewGroup((prev: any) => {
      return {
        ...prev,
        step3: data,
      };
    });

    // create group
    const res = await client
      .from("groups")
      .insert({
        academic_year_id: newGroup.step3.academic_year_id ?? 1,
        avatar_url: newGroup.step2.avatar_url ?? null,
        course: newGroup.step3.course ?? 2,
        cover_url: newGroup.step2.cover_url,
        description: newGroup.step1.description,
        name: newGroup.step1.name,
        school_id: newGroup.step3.school ?? 1,
        semester: newGroup.step3.semester ?? 2,
        vanity_id: newGroup.step1.vanity_id,
      })
      .select("*")
      .single();

    if (!res.data) {
      console.log("error creating group");
      console.log(res.error);
      setCreating(() => false);
      return;
    }

    // add the current student to the group
    const res2 = await client
      .from("group_members")
      .insert({
        student_id: Number(student?.id),
        group_id: Number(res.data!.id),
        creator: true,
        is_admin: true,
        profile_id: student?.profile_id + "",
        group_vanity_id: res.data?.vanity_id,
      })
      .select("*");

    if (!res2.data) {
      console.log("error creating group");
      console.log(res.error);
      show({
        header: "Error",
        message: "Something went wrong. Please try again",
        buttons: ["OK"],
      });
      setCreating(() => false);
      return;
    }

    // clear the new group
    setNewGroup(NEW_GROUP);

    // redirect the user to their newly created group using vanity url
    rt.push(
      `/group/vu/${res.data?.vanity_id}`,
      "forward",
      "replace"
    );
  };

  const { data: academicYears } = useFetchAcademicYears();
  const { data: colleges } = useFetchColleges();
  const { data: courses } = useFetchCourses();

  console.log(getValues());

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                text=""
                defaultHref={match.path.split("/")[1] + "/groups/create/p2"}
              />
            </IonButtons>
            {/* <IonTitle>Additional Information</IonTitle> */}
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow className="pb-[10px]">
            <IonCol>
              <IonText className="text-center">
                <h3>Additional Info</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonList className="rounded-xl">
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  School
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <Controller
                render={({ field }) => (
                  <IonSelect
                    label="Select College"
                    labelPlacement="start"
                    fill="outline"
                    interfaceOptions={{
                      header: "Select college ",
                    }}
                    className={`font-poppins`}
                    value={field.value}
                    onIonChange={(e) => setValue("college", e.detail.value)}
                  >
                    {colleges?.map((college) => (
                      <IonSelectOption
                        key={"college:" + college.id}
                        value={college.id}
                      >
                        {college.title}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                )}
                control={control}
                name="college"
              />
              {errors.college && (
                <IonNote class="ion-invalid">
                  {getFieldState("college").error?.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Course
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <Controller
                render={({ field }) => (
                  <IonSelect
                    label="Select Course"
                    labelPlacement="start"
                    fill="outline"
                    interfaceOptions={{
                      header: "Select course",
                    }}
                    className={`font-poppins`}
                    value={field.value}
                    onIonChange={(e) => setValue("course", e.detail.value)}
                  >
                    {courses?.map((course) => (
                      <IonSelectOption
                        key={"course:" + course.id}
                        value={course.id}
                      >
                        {course.title}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                )}
                control={control}
                name="course"
              />
              {errors.course && (
                <IonNote class="ion-invalid">
                  {getFieldState("course").error?.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Semester
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <Controller
                render={({ field }) => (
                  <IonSelect
                    label="Select Semester"
                    labelPlacement="start"
                    fill="outline"
                    interface="action-sheet"
                    interfaceOptions={{
                      header: "Select the semester",
                    }}
                    className={`font-poppins`}
                    value={field.value}
                    onIonChange={(e) => setValue("semester", e.detail.value)}
                  >
                    <IonSelectOption value={1}>1st Semester</IonSelectOption>
                    <IonSelectOption value={2}>2nd Semester</IonSelectOption>
                  </IonSelect>
                )}
                control={control}
                name="semester"
              />
              {errors.semester && (
                <IonNote class="ion-invalid">
                  {getFieldState("semester").error?.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Academic Year
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <Controller
                render={({ field }) => (
                  <IonSelect
                    label="Select A.Y."
                    labelPlacement="start"
                    fill="outline"
                    interfaceOptions={{
                      header: "Select the academic year",
                    }}
                    value={field.value}
                    interface="action-sheet"
                    onIonChange={(e) => setValue("academic_year_id", e.detail.value)}
                  >
                    {academicYears?.map((academicYear, index) => (
                      <IonSelectOption
                        key={"academicYear:" + academicYear.id + index}
                        value={academicYear.id}
                      >
                        {academicYear.academic_year}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                )}
                control={control}
                name="academic_year_id"
              />
              {errors.academic_year_id && (
                <IonNote class="ion-invalid">
                  {getFieldState("academic_year_id").error?.message}
                </IonNote>
              )}
            </IonItem>
          </IonList>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar className="px-2">
          <IonRow>
            <IonCol>
              <IonButton
                shape="round"
                className="font-poppins"
                expand="block"
                onClick={handleSubmit(handleNext)}
                disabled={creating}
              >
                {creating ? <IonSpinner name="crescent" className="mr-2 h-5" /> : ""} Create Group
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default CreateGroupP3;
