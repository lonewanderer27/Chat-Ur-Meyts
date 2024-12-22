import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonDatetime,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
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

import { FC, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { hideTabBar } from "../../utils/TabBar";
import useFetchSubjects from "../../hooks/setup/useFetchSubjects";
import { CrowdSourcedProfType, SubjectType } from "../../types";
import { subjSearchAtom } from "../../atoms/setup";
import { useAtom } from "jotai";
import useCrowdSourcedProf from "../../hooks/setup/useCrowdSourcedProf";
import { RouteComponentProps } from "react-router";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { newStudentAtom } from "../../atoms/student";
import { NewStudentTypeSteps } from "../../types/student/post/NewStudentType";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  addOutline,
  checkmarkOutline,
  chevronDown,
  closeOutline,
} from "ionicons/icons";
import { NEW_STUDENT } from "../../constants/student";
import GenerateAbbreviatedDays from "../../utils/GenerateAbbreviatedDays";
import useSetup from "../../hooks/setup/useSetup";
import useSetupDraftStudent from "../../hooks/setup/useSetupDraftStudent";
import useSelfDraftStudent from "../../hooks/student/useSelfDraftStudent";
import useSelfSetupDraftStudent from "../../hooks/setup/useSelfSetupDraftStudent";

// Define the specific subset of strings
const allowedValues = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const classSchemaInput = Yup.object().shape({
  subjectId: Yup.number().required("Subject is required"),
  room: Yup.string().optional(),
  daysofweek: Yup.array()
    .of(Yup.string().oneOf(allowedValues, "Invalid value").required())
    .min(0)
    .ensure()
    .optional(),
  startTime: Yup.string().optional(),
  endTime: Yup.string().optional(),
});

// Define the schema for individual class objects
const classSchema = Yup.object().shape({
  subjectId: Yup.number().required("Subject ID is required"),
  room: Yup.string().optional(),
  monday: Yup.boolean().optional(),
  tuesday: Yup.boolean().optional(),
  wednesday: Yup.boolean().optional(),
  thursday: Yup.boolean().optional(),
  friday: Yup.boolean().optional(),
  saturday: Yup.boolean().optional(),
  sunday: Yup.boolean().optional(),
  startTime: Yup.string().optional(),
  endTime: Yup.string().optional(),
});

// Define the main validation schema
const validationSchema = Yup.object().shape({
  classes: Yup.array().of(classSchema).required("Classes are required"),
});

const Setup4Classes: FC<RouteComponentProps> = ({ match }) => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const page = useRef(null);

  const classModal = useRef<HTMLIonModalElement>(null);
  const openClassModal = () => {
    classModal.current?.present();
  };

  const subjectsModal = useRef<HTMLIonModalElement>(null);
  const openSubjectsModal = () => {
    subjectsModal.current?.present();
  };

  const professorsModal = useRef<HTMLIonModalElement>(null);
  const openProfesorsModal = () => {
    professorsModal.current?.present();
  };

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(page.current);
  }, []);
  const { data: subjects } = useFetchSubjects();
  const [subjSearch, setSubjSearch] = useAtom(subjSearchAtom);
  const [filteredSubjects, setFilteredSubjects] = useState<SubjectType[]>(
    subjects ?? []
  );
  useEffect(() => {
    if (subjects) {
      setFilteredSubjects(
        subjects.filter((c) =>
          c.title.toLowerCase().includes(subjSearch.toLowerCase())
        )
      );
    }
  }, [subjSearch, subjects]);

  const { data: crowdSourcedProfessors } = useCrowdSourcedProf();
  const [profSearch, setProfSearch] = useAtom(subjSearchAtom);
  const [filteredProfessors, setFilteredProfessors] = useState<
    CrowdSourcedProfType[]
  >(crowdSourcedProfessors ?? []);
  useEffect(() => {
    if (crowdSourcedProfessors) {
      setFilteredProfessors(
        crowdSourcedProfessors.filter((c) =>
          c.full_name.toLowerCase().includes(profSearch.toLowerCase())
        )
      );
    }
  }, [profSearch, crowdSourcedProfessors]);

  const [newStudent, setNewStudent] = useAtom(newStudentAtom);

  const {
    handleSubmit,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<NewStudentTypeSteps["step3"]>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      classes: [],
    },
  });

  const handlePageNextError: SubmitErrorHandler<
    NewStudentTypeSteps["step3"]
  > = (errors) => {
    console.log("handleError");
    console.log(errors);
    console.log(getValues());
  };

  const ds = useSelfSetupDraftStudent();
  const { handleDraftClasses, uploading, handleNext } = useSetupDraftStudent();
  const handlePageNext: SubmitHandler<NewStudentTypeSteps["step3"]> = async (
    data
  ) => {
    console.log("handleNext");
    console.log(data);

    setNewStudent((prev) => ({
      ...prev,
      step3: data,
    }));

    await handleDraftClasses(data, ds.data?.id!);

    // refetch the draft student
    await ds.refetch();

    // navigate to the interests screen
    await handleNext();
  };

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setError: setError2,
    getFieldState: getFieldState2,
    getValues: getValues2,
    setValue: setValue2,
    trigger: trigger2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm<{
    subjectId: number;
    room?: string;
    daysofweek?: string[];
    startTime?: string;
    endTime?: string;
  }>({
    resolver: yupResolver(classSchemaInput),
    defaultValues: {
      daysofweek: [],
    },
  });

  const handleClassAddError: SubmitErrorHandler<{
    subjectId: number;
    room: string;
    daysofweek: string[];
    startTime: string;
    endTime: string;
  }> = (errors) => {
    console.log("handleError");
    console.log(errors);
    console.log(getValues2());
  };

  const handleAddClass: SubmitHandler<{
    subjectId: number;
    room?: string;
    daysofweek?: string[];
    startTime?: string;
    endTime?: string;
  }> = async (data) => {
    console.log("handleNext");
    console.log(data);
    console.log("getValues: ", getValues());

    // do checks

    // check if the startTime is before the endTime
    if (dayjs(data.startTime).isAfter(data.endTime)) {
      setError2("startTime", {
        type: "value",
        message: "Start time should be before end time",
      });
      return;
    }

    // check if there's a subject selected
    if (data.subjectId === 0) {
      setError2("subjectId", {
        type: "value",
        message: "Subject is required",
      });
      return;
    }

    // check if the class is already added
    // by checking if an existing subjectId is already in the classes array
    if (
      getValues("classes")?.find((c) => c.subjectId === data.subjectId) !==
      undefined
    ) {
      setError2("subjectId", {
        type: "value",
        message: "Class already exists",
      });
      return;
    }

    const daysofweek = getValues2("daysofweek") ?? [];

    // success
    setValue("classes", [
      ...(getValues("classes") ?? []),
      {
        subjectId: getValues2("subjectId"),
        room: getValues2("room")!,
        monday: daysofweek.includes("monday"),
        tuesday: daysofweek.includes("tuesday"),
        wednesday: daysofweek.includes("wednesday"),
        thursday: daysofweek.includes("thursday"),
        friday: daysofweek.includes("friday"),
        saturday: daysofweek.includes("saturday"),
        sunday: daysofweek.includes("sunday"),
        startTime: dayjs(getValues2("startTime")).format()!,
        endTime: getValues2("endTime")!,
      },
    ]);

    // reset the form
    reset2({
      subjectId: 0,
      room: "",
      daysofweek: [],
      startTime: "",
      endTime: "",
    });

    // dismiss the class modal
    classModal.current?.dismiss();
  };

  const handleDeleteClass = (subjectId: number) => {
    setValue(
      "classes",
      getValues("classes")?.filter((c) => c.subjectId !== subjectId)
    );

    trigger("classes");
  };

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
                <h3>Classes</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonList className="rounded-xl">
                {getValues("classes")?.map((c, index) => (
                  <IonItemSliding key={"class:" + index}>
                    <IonItem className="rounded-xl">
                      <IonLabel>
                        <h3>
                          {subjects?.find((s) => s.id === c.subjectId)?.title}
                        </h3>
                        <p>
                          {GenerateAbbreviatedDays({
                            monday: c.monday,
                            tuesday: c.tuesday,
                            wednesday: c.wednesday,
                            thursday: c.thursday,
                            friday: c.friday,
                            saturday: c.saturday,
                            sunday: c.sunday,
                          })}{" "}
                          | {dayjs(c.startTime).isValid() && dayjs(c.startTime).format("hh:mm A")} -{" "}
                          {dayjs(c.endTime).isValid() && dayjs(c.endTime).format("hh:mm A")}
                        </p>
                      </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption
                        color="danger"
                        onClick={() => handleDeleteClass(c.subjectId)}
                        disabled={uploading}
                      >
                        Delete
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={openClassModal} expand="block" fill="outline">
                <IonLabel>
                  <IonText>Add Class</IonText>
                </IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Class Modal */}
        <IonModal ref={classModal} presentingElement={presentingElement!}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {subjects?.find((s) => s.id === getValues2("subjectId"))
                  ?.title ?? "New Class"}
              </IonTitle>
              <IonButtons slot="start">
                <IonButton
                  fill="clear"
                  onClick={() => classModal.current?.dismiss()}
                >
                  <IonIcon src={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow className="px-4">
                <IonCol>
                  <IonAccordionGroup className="mx-[-15px]">
                    <IonAccordion value="start_time">
                      <IonItem slot="header" color="light" lines="none">
                        <IonLabel>
                          <IonText className="font-poppins font-semibold text-lg">
                            Start Time
                          </IonText>
                        </IonLabel>
                      </IonItem>
                      <IonDatetime
                        presentation="time"
                        preferWheel={true}
                        onIonChange={(e) => {
                          console.log(e.detail.value);
                          setValue2("startTime", e.detail.value + "");
                          trigger2(["startTime", "endTime"]);
                        }}
                        value={getValues2("startTime")}
                        slot="content"
                      />
                      {errors2.startTime && (
                        <div>
                          <IonText color="danger">
                            {errors2.startTime.message}
                          </IonText>
                        </div>
                      )}
                    </IonAccordion>
                    <IonAccordion value="end_time">
                      <IonItem slot="header" color="light" lines="none">
                        <IonLabel>
                          <IonText className="font-poppins font-semibold text-lg">
                            End Time
                          </IonText>
                        </IonLabel>
                      </IonItem>
                      <IonDatetime
                        presentation="time"
                        preferWheel={true}
                        onIonChange={(e) => {
                          console.log(e.detail.value);
                          setValue2("endTime", e.detail.value + "");
                        }}
                        min={getValues2("startTime")!}
                        value={getValues2("endTime")}
                        slot="content"
                      />
                      {errors2.endTime && (
                        <div>
                          <IonText color="danger">
                            {errors2.endTime.message}
                          </IonText>
                        </div>
                      )}
                    </IonAccordion>
                  </IonAccordionGroup>
                </IonCol>
              </IonRow>
              <IonRow className="px-4">
                <IonCol>
                  <IonLabel>
                    <IonText className="font-poppins font-semibold text-lg">
                      Days of the Week
                    </IonText>
                  </IonLabel>
                  <div>
                    <IonSelect
                      aria-label="Fruit"
                      placeholder="Select Days"
                      multiple={true}
                      interfaceOptions={{
                        header: "Select all days that apply",
                      }}
                      justify="space-between"
                      onIonChange={(e) => {
                        console.log(e.detail.value);
                        setValue2("daysofweek", e.detail.value ?? []);
                      }}
                      value={getValues2("daysofweek") ?? []}
                    >
                      <IonSelectOption value="monday">Monday</IonSelectOption>
                      <IonSelectOption value="tuesday">Tuesday</IonSelectOption>
                      <IonSelectOption value="wednesday">
                        Wednesday
                      </IonSelectOption>
                      <IonSelectOption value="thursday">
                        Thursday
                      </IonSelectOption>
                      <IonSelectOption value="friday">Friday</IonSelectOption>
                      <IonSelectOption value="saturday">
                        Saturday
                      </IonSelectOption>
                      <IonSelectOption value="sunday">Sunday</IonSelectOption>
                    </IonSelect>
                  </div>
                  {errors2.daysofweek && (
                    <div>
                      <IonText color="danger">
                        {errors2.daysofweek.message}
                      </IonText>
                    </div>
                  )}
                </IonCol>
              </IonRow>
              <IonRow className="px-4">
                <IonCol>
                  <IonLabel>
                    <IonText className="font-poppins font-semibold text-lg">
                      Subject
                    </IonText>
                  </IonLabel>
                  {
                    <IonInput
                      onClick={openSubjectsModal}
                      placeholder="Select your subject"
                      readonly
                      value={subjects
                        ?.find((subj) => subj.id === getValues2("subjectId"))
                        ?.title.trim()}
                    />
                  }
                  {errors2.subjectId && (
                    <div>
                      <IonText color="danger">
                        {errors2.subjectId.message}
                      </IonText>
                    </div>
                  )}
                </IonCol>
              </IonRow>
              <IonRow className="px-4">
                <IonCol>
                  <IonLabel>
                    <IonText className="font-poppins font-semibold text-lg">
                      Room
                    </IonText>
                  </IonLabel>
                  <div>
                    <IonInput
                      type="text"
                      placeholder="Enter your room code"
                      value={getValues2("room")}
                      onIonInput={(e) => {
                        setValue2("room", e.detail.value!.toLocaleUpperCase());
                        trigger2("room");
                      }}
                    />
                  </div>
                  {errors2.room && (
                    <div>
                      <IonText color="danger">{errors2.room.message}</IonText>
                    </div>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFooter className="p-4">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => classModal.current?.dismiss()}
                    shape="round"
                    expand="block"
                    color="medium"
                  >
                    <IonLabel>
                      <IonText>Cancel</IonText>
                    </IonLabel>
                    <IonIcon src={closeOutline} slot="start" />
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    shape="round"
                    expand="block"
                    color="success"
                    onClick={handleSubmit2(handleAddClass, handleClassAddError)}
                  >
                    <IonLabel>
                      <IonText>Complete</IonText>
                    </IonLabel>
                    <IonIcon src={checkmarkOutline} slot="start" />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonFooter>
        </IonModal>

        {/* Subjects Modal */}
        <IonModal
          ref={subjectsModal}
          initialBreakpoint={0.95}
          breakpoints={[0, 0.95]}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select your subject</IonTitle>
            </IonToolbar>
            <IonSearchbar
              value={subjSearch}
              onIonInput={(e) => {
                setSubjSearch(e.detail.value ?? "");
              }}
            />
          </IonHeader>
          <IonContent>
            <IonList>
              {filteredSubjects?.map((subject, index) => (
                <IonItem
                  key={"course:" + subject.title + index}
                  onClick={() => {
                    setValue2("subjectId", subject.id);
                    trigger2("subjectId");
                    subjectsModal.current?.dismiss();
                  }}
                >
                  <IonLabel>{subject.title}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        {/* Professors Modal */}
        <IonModal
          ref={professorsModal}
          initialBreakpoint={0.95}
          breakpoints={[0, 0.95]}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select your professor</IonTitle>
            </IonToolbar>
            <IonSearchbar
              value={subjSearch}
              onIonInput={(e) => {
                setProfSearch(e.detail.value ?? "");
              }}
            />
          </IonHeader>
          <IonContent>
            <IonList>
              {filteredProfessors?.map((c, index) => (
                <IonItem key={"course:" + c.full_name + index}>
                  <IonLabel>{c.full_name}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
      <IonFooter>
        <IonToolbar className="p-4">
          {/* TODO */}
          <IonButton
            shape="round"
            slot="end"
            size="small"
            onClick={handleSubmit(handlePageNext, handlePageNextError)}
            disabled={uploading}
          >
            <IonText className='py-3'>
              {uploading ? <IonSpinner name="dots" /> : "Next"}
            </IonText>
          </IonButton>
          {/* <IonButton
            shape="round"
            slot="end"
            expand="block"
            onClick={handleSubmit(handlePageNext, handlePageNextError)}
            disabled={uploading}
          >
            COMPLETE
          </IonButton> */}
        </IonToolbar>
      </IonFooter>
      {uploading && (
        <IonLoading
          message={"Uploading your data"}
          isOpen={uploading}
          spinner="circular"
        />
      )}
    </IonPage>
  );
};

export default Setup4Classes;
