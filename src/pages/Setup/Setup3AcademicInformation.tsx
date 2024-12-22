import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";

import { hideTabBar } from "../../utils/TabBar";
import useSetup from "../../hooks/setup/useSetup";
import useFetchCourses from "../../hooks/setup/useFetchCourses";
import { FC, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useAtom } from "jotai";
import { courseSearchAtom, subjSearchAtom } from "../../atoms/setup";
import { AcademicYearType, CourseType } from "../../types";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { NewStudentTypeSteps } from "../../types/student/post/NewStudentType";
import { newStudentAtom } from "../../atoms/student";
import { boolean, number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetchAcademicYears from "../../hooks/setup/useFetchAcademicYears";
import { caretDown, closeOutline } from "ionicons/icons";
import useSetupDraftStudent from "../../hooks/setup/useSetupDraftStudent";
import useSelfSetupDraftStudent from "../../hooks/setup/useSelfSetupDraftStudent";

const validationSchema = object().shape({
  studentNo: number().required("Student No. is required"),
  course: number().required("Course is required"),
  yearLevel: number().required("Year Level is required"),
  academicYear: number().required("Academic Year is required"),
  type: boolean().required("Type is required"),
  block: string().optional(),
});

const Setup3AcademicInformation: FC<RouteComponentProps> = ({ match }) => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const { handleNext: next } = useSetup();
  const courseModal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  const openCourseModal = () => {
    courseModal.current?.present();
  };

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(page.current);
  }, []);
  const [courseSearch, setCourseSearch] = useAtom(courseSearchAtom);

  const { data: courses } = useFetchCourses();
  const { data: academicYears } = useFetchAcademicYears();
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>(
    courses ?? []
  );
  useEffect(() => {
    if (courses) {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(courseSearch.toLowerCase())
        )
      );
    }
  }, [courseSearch, courses]);

  const [studentNo, setStudentNo] = useState<number | null>(null);
  const [course, setCourse] = useState<CourseType | null>(null);
  const [yearLevel, setYearLevel] = useState<number | null>(null);
  const [academicYear, setAcademicYear] = useState<AcademicYearType | null>(
    null
  );
  const [isRegular, setIsRegular] = useState<boolean | null>(null);

  const [newStudent, setNewStudent] = useAtom(newStudentAtom);
  const {
    register,
    handleSubmit,
    setError,
    getFieldState,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<NewStudentTypeSteps["step2"]>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      // check if there is a value in the student atom
      // if there is, set the default values to that
      // else, set the default values to an empty object
      studentNo:
        newStudent.step2.studentNo !== 0
          ? newStudent.step2.studentNo!
          : undefined,
      course:
        newStudent.step2.course !== 0 ? newStudent.step2.course : undefined,
      yearLevel:
        newStudent.step2.yearLevel !== 0
          ? newStudent.step2.yearLevel
          : undefined,
      academicYear:
        newStudent.step2.academicYear !== 0
          ? newStudent.step2.academicYear
          : undefined,
      type:
        newStudent.step2.type !== undefined
          ? newStudent.step2.type
          : undefined,
      block: newStudent.step2.block,
    },
  });
  const [checking, setChecking] = useState(() => false);
  const handleError: SubmitErrorHandler<NewStudentTypeSteps["step2"]> = (
    errors,
    event
  ) => {
    console.log("handleError");
    console.log(errors);
    console.log(getValues());
  };
  const ds = useSelfSetupDraftStudent();
  const { handleDraftAcademicInfo, setUploading, uploading } = useSetupDraftStudent();
  const handleNext: SubmitHandler<NewStudentTypeSteps["step2"]> = async (
    data
  ) => {
    console.log("handleNext");
    console.log(data);
    setUploading(() => true);
    setChecking(() => true);
    setNewStudent((prev) => ({
      ...prev,
      step2: data,
    }));

    // update the draft student record with the data
    await handleDraftAcademicInfo({
      student_no: data.studentNo.toString(),
      course_id: data.course,
      year_level: data.yearLevel,
      academic_year_id: data.academicYear,
      type: data.type ? "regular" : "irregular",
      block: data.block,
    }, ds.data?.id!)

    // // refetch the draft student record
    await ds.refetch();

    setChecking(() => false);
    setUploading(() => false);

    // route to next page
    next();
  };

  const handleCourse = (course: CourseType) => {
    setValue("course", course.id);
    setCourse(course);
    courseModal.current?.dismiss();
  };

  const handleAcademicYear = (academicYear: AcademicYearType) => {
    setValue("academicYear", academicYear.id);
    setAcademicYear(academicYear);
  };

  useEffect(() => {
    console.log(getValues());
  }, []);

  return (
    <IonPage ref={page}>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref={"/" + match.path.split("/")[1]}
                text=""
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow className="pb-[20px]">
            <IonCol>
              <IonText className="text-center">
                <h3>Academic Information</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonList className="rounded-xl">
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Student No
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <IonInput
                errorText={errors.studentNo?.message}
                {...register("studentNo")}
                type="number"
                placeholder="Enter your student no."
                value={getValues("studentNo")}
              />
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Course
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" onClick={openCourseModal}>
              <IonInput
                errorText={errors.course?.message}
                // onClick={openCourseModal}
                placeholder="Select your course"
                readonly
                value={
                  courses?.find((course) => course.id === getValues("course"))
                    ?.full_title ?? ""
                }
              />
              <IonIcon src={caretDown} size="small" />
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Year Level
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <IonSelect
                {...register("yearLevel")}
                interface="action-sheet"
                interfaceOptions={{
                  header: "Select your year level",
                }}
                placeholder="Select your year level"
              >
                <IonSelectOption value={1}>1st Year</IonSelectOption>
                <IonSelectOption value={2}>2nd Year</IonSelectOption>
                <IonSelectOption value={3}>3rd Year</IonSelectOption>
                <IonSelectOption value={4}>4th Year</IonSelectOption>
              </IonSelect>
              {/* </div> */}
              {errors.yearLevel && (
                <div>
                  <IonText color="danger">Year Level is required</IonText>
                </div>
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
              <div className="flex justify-center">
                <IonSelect
                  interface="action-sheet"
                  interfaceOptions={{
                    header: "Select your academic year",
                  }}
                  placeholder="Select your academic year"
                  {...register("academicYear")}
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
              </div>
              {errors.academicYear && (
                <div>
                  <IonText color="danger">Academic Year is required</IonText>
                </div>
              )}
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Do you have a block section?
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <IonRadioGroup
                onIonChange={(e) => {
                  setValue("type", e.detail.value);
                  trigger("block");
                }}
                value={getValues("type")}
              >
                <IonRadio value={true} slot="start" labelPlacement="end">
                  Yes
                </IonRadio>
                <IonRadio value={false} slot="end" className="ml-[25px]" labelPlacement="end">
                  No
                </IonRadio>
              </IonRadioGroup>
              {errors.type && (
                <div>
                  <IonText color="danger">{errors.type.message}</IonText>
                </div>
              )}
            </IonItem>
            {getValues("type") && (
              <>
                <IonItem lines="none" className="mb-[-10px]">
                  <IonLabel>
                    <IonText className="font-poppins font-semibold text-lg">
                      Block No
                    </IonText>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonInput
                    errorText={errors.block?.message}
                    {...register("block")}
                    placeholder="Enter your Block No."
                    value={getValues("block")}
                  />
                </IonItem>
              </>)}
          </IonList>
        </IonGrid>
        <IonModal ref={courseModal} presentingElement={presentingElement!}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select your course</IonTitle>
              <IonButtons slot="start">
                <IonButton
                  fill="clear"
                  onClick={() => {
                    courseModal.current?.dismiss();
                  }}
                >
                  <IonIcon src={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonHeader>
              <IonSearchbar
                value={courseSearch}
                onIonInput={(e) => {
                  setCourseSearch(e.detail.value ?? "");
                }}
              />
            </IonHeader>
            <IonList>
              {filteredCourses?.map((course, index) => (
                <IonItem
                  key={"course:" + course.title + index}
                  onClick={() => handleCourse(course)}
                >
                  <IonLabel>{course.full_title}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
      <IonFooter>
        <IonToolbar className="p-4 flex justify-end">
          <IonButton
            shape="round"
            slot="end"
            size="small"
            onClick={handleSubmit(handleNext, handleError)}
          >
            <IonText className="py-3">
              {uploading ? (
                <IonSpinner name="dots" />
              ) : (
                "Next"
              )}
            </IonText>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Setup3AcademicInformation;
