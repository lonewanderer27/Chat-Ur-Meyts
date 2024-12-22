import { IonBackButton, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonPage, IonRow, IonSearchbar, IonSpinner, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import { useEffect, useState } from 'react'
import useHobbies from '../../../hooks/hobbies/useHobbies';
import useHobbyCategories from '../../../hooks/hobbies/useHobbyCategories';
import { HobbyType } from '../../../types';
import { hideTabBar } from '../../../utils/TabBar';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { NewStudentTypeSteps } from '../../../types/student/post/NewStudentType';
import { hobbiesValidationSchema } from '../../Setup/Setup5Hobbies';
import useSelfHobbies from '../../../hooks/student/useSelfHobbies';
import client from '../../../client';
import useSelfStudentLite from '../../../hooks/student/useSelfStudentLite';
import { useToggleTheme } from '../../../hooks/useToggleTheme';
import { useDebounceValue } from 'usehooks-ts';

const UpdateHobbies = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });
  const [uploading, setUploading] = useState(false);
  const { hobbies: selfHbbys, query: selfHbbysQry } = useSelfHobbies();
  const hcqR = useHobbyCategories();
  const hqR = useHobbies();

  const [hobsSearch, setHobsSearch] = useState("");
  const [debouncedHobsSearch] = useDebounceValue(hobsSearch, 300);
  const [filteredHobbies, setFilteredHobbies] = useState<HobbyType[]>(
    hqR.data ?? []
  );
  const handleSearch = (e: CustomEvent) => {
    setHobsSearch(e.detail.value);
  }
  useEffect(() => {
    if (hqR.data) {
      setFilteredHobbies(
        hqR.data.filter((h) =>
          h.title.toLowerCase().includes(hobsSearch.toLowerCase())
        )
      );
      // console.log("filtered hobbies", filteredHobbies);
    }
  }, [debouncedHobsSearch, hqR.data]);
  const { handleSubmit, setValue } = useForm<NewStudentTypeSteps["step4"]>({
    resolver: yupResolver(hobbiesValidationSchema),
    defaultValues: async () => {
      return {
        hobbies: selectedHobbyIds
      }
    }
  });
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>(() => selfHbbys.map(h => h.id));
  const toggleHobbySelection = (hobbyId: number) => {
    setSelectedHobbyIds(prevIds => {
      const newIds = prevIds.includes(hobbyId)
        ? prevIds.filter(id => id !== hobbyId)
        : [...prevIds, hobbyId];
      setValue("hobbies", newIds)

      return newIds;
    });
  }
  useEffect(() => {
    setSelectedHobbyIds(selfHbbys.map(h => h.id));
  }, [selfHbbysQry.data]);
  const isHobbySelected = (hobbyId: number) => selectedHobbyIds.includes(hobbyId);
  const getInterestMessage = () => {
    const count = selectedHobbyIds.length + newHobbies.filter(h => h.selected).length;
    switch (count) {
      case 0:
        return "Add five hobbies to find even more klasmeyts";
      case 1:
        return "Great start! You can add up to 4 more interests";
      case 2:
      case 3:
        return `Nice choices! You can add up to ${5 - count} more`;
      case 4:
        return "Excellent! You can add one more interest if you'd like";
      default:
        return `Perfect! You've selected ${count} interests. Feel free to add more`;
    }
  }

  const [newHobbies, setNewHobbies] = useState<{
    id: number;
    title: string;
    selected: boolean;
  }[]>([]);
  const handleAddCustomHobby = () => {
    setNewHobbies((prevHobbies) => [...prevHobbies, { id: prevHobbies.length, title: hobsSearch, selected: true }]);
    setHobsSearch("");
  }
  const toggleCustomHobbySelection = (id: number) => {
    setNewHobbies((prevHobbies) => prevHobbies.map((h) => h.id === id ? { ...h, selected: !h.selected } : h));
  }
  const isCustomHobbySelected = (index: number) => newHobbies[index].selected;

  const rt = useIonRouter();
  const { student } = useSelfStudentLite();
  const handlePageNext: SubmitHandler<NewStudentTypeSteps['step4']> = async (data) => {
    console.log("selected hobbies", selectedHobbyIds);

    // let's upload the hobbies
    setUploading(() => true);

    // Remove the existing student hobbies
    const { error: deleteError } = await client
      .from("student_hobbies")
      .delete()
      .eq("student_id", student?.id!);

    if (deleteError) {
      console.error("Error deleting student hobbies", deleteError);
      return setUploading(() => false);
    }

    // Create the custom hobbies object that will be uploaded
    const customHbbys = newHobbies.filter(h => h.selected).map(h => ({
      title: h.title,
      created_by_student_id: student?.id,
      is_custom: true
    }));

    // Upload the new custom hobbies
    // And get the new hobbies id
    const { data: nhobbies, error: customError } = await client
      .from("hobbies")
      .insert(customHbbys)
      .select("id");

    if (customError) {
      console.error("Error uploading custom hobbies", customError);
      return setUploading(() => false);
    }

    // Create the hobbies object that will be uploaded
    const hbbys = hqR.data!.filter(h => selectedHobbyIds.includes(h.id)).map(h => ({
      student_id: student?.id!,
      hobby_id: h.id
    }));

    // Create the hobbies object for the new custom hobbies
    hbbys.push(...nhobbies.map((h: { id: number }) => ({
      student_id: student?.id!,
      hobby_id: h.id
    })));

    // Upload the final list of hobbies
    const { error } = await client
      .from("student_hobbies")
      .insert(hbbys);

    if (error) {
      console.error("Error uploading student hobbies", error);
      return setUploading(() => false);
    }

    // Reset the new hobbies
    setNewHobbies(() => []);

    setUploading(() => false);

    // Refresh my hobbies
    selfHbbysQry.refetch();

    // go back to me page
    // lets try if we can pop to the me page
    if (rt.canGoBack()) {
      rt.goBack();
    } else {
      // rt.push("/discover/me");

      // lets try if we can pop to the either discover or community me page
      rt.push("/" + rt.routeInfo.pathname.split("/")[1] + "/me");
    }
  }
  const handlePageError: SubmitErrorHandler<NewStudentTypeSteps['step4']> = (errors) => {
    console.error("errors", errors);
  }

  const [darkMode] = useToggleTheme('darkModeActivated', 'ion-palette-dark');

  return (
    <IonPage>
      <IonContent>
        <IonContent className='ion-padding'>
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                defaultHref={"/" + rt.routeInfo.pathname.split("/")[1] + "/me"}
                text='Me'
              />
            </IonButtons>
            <IonTitle>
              Update Interests
            </IonTitle>
            <IonButtons slot='end'>
              <IonButton
                disabled={selfHbbysQry.isLoading || selectedHobbyIds.length < 5 || uploading}
                onClick={handleSubmit(handlePageNext, handlePageError)}
              >
                {uploading ? <IonSpinner name="dots" /> : "Save"}
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText className='text-center'>
                  <h4>{getInterestMessage()}</h4>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow className='mx-[-13px]'>
              <IonCol>
                <IonSearchbar
                  value={hobsSearch}
                  animated
                  onIonInput={(e) => {
                    handleSearch(e);
                    setHobsSearch(e.detail.value!);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" &&
                      (filteredHobbies.length === 0 &&
                        !hcqR.isLoading &&
                        !hqR.isLoading &&
                        !selfHbbysQry.isFetching &&
                        hobsSearch.length !== 0)) {
                      handleAddCustomHobby();
                    }
                  }}
                  placeholder='Search topics'
                />
              </IonCol>
            </IonRow>

            {/* If the search bar is not empty and no hobbies are found,
            the user can add a custom hobby by clicking on this chip */}
            {(filteredHobbies.length === 0 &&
              !hcqR.isLoading &&
              !hqR.isLoading &&
              !selfHbbysQry.isFetching &&
              hobsSearch.length !== 0) && (
                <IonGrid className='mx-[-5px]'>
                  <IonRow>
                    <IonChip
                      className={`${darkMode ? 'outline outline-1' : ''}`}
                      onClick={handleAddCustomHobby}
                      disabled={selfHbbysQry.isLoading === true || uploading}
                    >
                      <IonText>{hobsSearch}</IonText>
                    </IonChip>
                  </IonRow>
                </IonGrid>
              )}

            {/* A custom hobby is a hobby that is not in the list of hobbies. 
            You can add a custom hobby by typing the hobby in the search bar 
            and clicking on the hobby that appears in the search results.   */}
            {(!hcqR.isLoading &&
              !hqR.isLoading &&
              !selfHbbysQry.isFetching &&
              hobsSearch.length == 0) &&
              newHobbies.map((h, i) => (
                <IonChip
                  key={i}
                  color={isCustomHobbySelected(h.id) ? "primary" : undefined}
                  onClick={() => toggleCustomHobbySelection(h.id)}
                  className={`${darkMode ? 'outline outline-1' : ''}`}
                  disabled={selfHbbysQry.isLoading === true || uploading}
                >
                  <IonText>
                    <p>{h.title}</p>
                  </IonText>
                </IonChip>
              ))}

            {/* Displays the custom hobbies of other users */}
            {(!hcqR.isLoading &&
              !hqR.isLoading &&
              !selfHbbysQry.isFetching) &&
              filteredHobbies
                .filter((h) => h.category_id === null)
                .map((h, i) => (
                  <IonChip
                    key={i}
                    color={isHobbySelected(h.id) ? "primary" : undefined}
                    onClick={() => toggleHobbySelection(h.id)}
                    className={`${darkMode ? 'outline outline-1' : ''}`}
                    disabled={selfHbbysQry.isLoading === true || uploading}
                  >
                    <IonText>
                      <p>{h.title}</p>
                    </IonText>
                  </IonChip>
                ))}

            {/* Hobbies from our database */}
            {(!hcqR.isLoading &&
              !hqR.isLoading &&
              !selfHbbysQry.isFetching) 
                && hcqR.data?.map((hc) => {
                const hobbiesInCategory = filteredHobbies.filter((h) => h.category_id === hc.id);
                if (hobbiesInCategory.length === 0) {
                  return null; // Skip rendering this category if no hobbies match
                }
                return (
                  <IonGrid className='mx-[-5px]' key={hc.id}>
                    <IonRow key={hc.id}>
                      <IonCol>
                        <IonText>
                          <h6 className="font-semibold">{hc.title}</h6>
                        </IonText>
                      </IonCol>
                    </IonRow>
                    <IonRow className='mx-[-5px] mt-[-12px]'>
                      <IonCol>
                        {filteredHobbies &&
                          filteredHobbies
                            .filter((h) => h.category_id === hc.id).map((h) => (
                              <IonChip
                                key={h.id}
                                color={isHobbySelected(h.id) ? "primary" : undefined}
                                onClick={() => toggleHobbySelection(h.id)}
                                className={`${darkMode ? 'outline outline-1' : ''}`}
                                disabled={selfHbbysQry.isLoading === true || uploading}
                              >
                                <IonText>
                                  <p>{h.title}</p>
                                </IonText>
                              </IonChip>
                            ))}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                )
              })
              }

          </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  )
}

export default UpdateHobbies