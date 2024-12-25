import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import { close, imageOutline, peopleCircleOutline, remove, removeCircleOutline, sendOutline, star } from 'ionicons/icons';
import { FC, useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { hideTabBar } from '../../utils/TabBar';
import { useDropzone } from "react-dropzone";
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { NewGroupPostInput } from '../../types/group/NewPost';
import useGroupInfoLite from '../../hooks/group/useGroupInfoLite';
import { isValidUrl } from '../../utils/ValidUrl';
import useAmIAMember from '../../hooks/group/useAmIAMember';
import GroupPreview from './GroupPreview';
import client from '../../client';
import useMeGroupMember from '../../hooks/group/useMeGroupMember';
import useSelfStudentLite from '../../hooks/me/useSelfStudentLite';

const validationSchema = object().shape({
  title: string().optional().min(3).max(255),
  content: string().required("Content is required").min(3).max(10000),
});

const GroupCreateNewPost: FC<RouteComponentProps<{ vanity_url: string }>> = (p) => {
  const imageModal = useRef<HTMLIonModalElement>(null);
  useIonViewWillEnter(() => {
    hideTabBar();
  });
  const rt = useIonRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [posting, setPosting] = useState(false);
  const { data: group } = useGroupInfoLite(p.match.params.vanity_url);
  const { profile } = useSelfStudentLite();
  const { data: MeGroupMember } = useMeGroupMember(p.match.params.vanity_url);

  const [image, setImage] = useState<File | null>(null);
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, open } =
    useDropzone({
      accept: {
        'image/jpeg': [],
        'image/png': []
      },
      maxFiles: 1,
      onDrop: (acceptedFiles) => setImage(acceptedFiles[0]),
    });

  const {
    register,
    handleSubmit,
    getFieldState,
    getValues,
    reset,
    setValue,
    formState: { errors },
    control,
  } = useForm<NewGroupPostInput>({
    resolver: yupResolver(validationSchema),
  });

  const handleError: SubmitErrorHandler<NewGroupPostInput> = (errors) => {
    console.error(errors);
  }

  const handlePost: SubmitHandler<NewGroupPostInput> = async (inputData) => {
    // TODO: Post the data
    setPosting(true);
    const newPost = await client
      .from("group_posts")
      .insert({
        title: inputData.title,
        content: inputData.content,
        student_id: profile?.student[0].id!,
        member_id: MeGroupMember?.id!,
        group_id: group?.id!,
        group_vanity_id: group?.vanity_id!
      })
      .select("*")
      .single();

    if (!image) {
      setPosting(false);
      rt.push("/group/vu/" + group?.vanity_id + "/post/" + newPost.data!.id);
      reset();
      return;
    };

    setUploadingImage(true);
    const imageUpload = await client
      .storage
      .from("group_posts")
      .upload(group?.id + "/group/id/" + newPost.data!.id + "/post/", image!);

    if (imageUpload.error) {
      console.error(imageUpload.error);
    }

    // get the public url
    // TODO: Update the post with an image path
    const imageUrl = await client
      .storage
      .from("group_posts")
      .getPublicUrl(imageUpload.data!.path);

    const updatedPost = await client
      .from("group_posts")
      .update({ image_url: imageUrl.data.publicUrl })
      .eq("id", newPost.data!.id)

    if (updatedPost.error) {
      console.error(updatedPost.error);
    };

    setUploadingImage(false);
    setPosting(false);
    reset();
    rt.push("/group/vu/" + group?.vanity_id + "/post/" + newPost.data!.id);
  }

  const AIM = useAmIAMember(p.match.params.vanity_url);
  if (AIM.isLoading) {
    return <IonLoading isOpen={true} />;
  }

  if (AIM.isLoading === false) {
    if (AIM.data === null || AIM.data?.approved === false) {
      return <GroupPreview {...p} />;
    }
  }

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref={"/" + rt.routeInfo.pushedByRoute}
                text=""
                disabled={posting}
              />
            </IonButtons>
            <IonButtons slot="end">
              <IonButton fill="clear">
                <IonIcon src={sendOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList className='rounded-xl mt-5'>
          <IonItem lines={"none"}>
            <IonInput placeholder="Post to" readonly />
            <IonButton slot="end" fill="clear" color="medium">
              <div className='w-5 h-auto mr-2'>
                {isValidUrl(group?.avatar_url + "") ? (
                  <img src={group?.avatar_url + ""} className="rounded-full aspect-square" />
                ) : (
                  <IonIcon
                    className="text-3xl m-[-3px]"
                    icon={peopleCircleOutline}
                  />
                )}
              </div>
              <IonText>{group?.name}</IonText>
            </IonButton>
          </IonItem>
        </IonList>
        <IonList className='rounded-xl mt-5'>
          <IonItem lines={"full"}>
            <IonInput placeholder="Title" {...register("title")} disabled={posting} />
          </IonItem>
          <IonItem lines={"full"}>
            <IonTextarea
              placeholder="Content"
              rows={6}
              maxlength={10000}
              autoGrow
              {...register("content")}
              disabled={posting}
            />
          </IonItem>
          {!image &&
            <IonItem lines="none" onClick={open}>
              <IonInput placeholder="Attach Image" readonly />
              <input {...getInputProps()} disabled={posting} />
              <IonIcon src={imageOutline} slot="end" />
            </IonItem>}
          {image && (
            <>
              <IonItem lines="none">
                <div className='rounded-xl'>
                  <IonImg
                    id="view-attached-image"
                    src={URL.createObjectURL(image)}
                    className='pt-5 aspect-video object-cover rounded-2xl'
                  />
                </div>
              </IonItem>
              <IonItem lines="none">
                <div {...getRootProps()}>
                  <IonButton
                    slot="start"
                    fill="clear"
                  >
                    <IonLabel>Change</IonLabel>
                    <input {...getInputProps()} />
                    <IonIcon slot="start" src={imageOutline} />
                  </IonButton>
                </div>
                <IonButton
                  slot="end"
                  fill="clear"
                  onClick={() => setImage(null)}
                  color="danger"
                >
                  <IonLabel>Remove</IonLabel>
                  <IonIcon slot="start" src={removeCircleOutline} />
                </IonButton>
              </IonItem>
            </>
          )}
        </IonList>
        <IonModal ref={imageModal} trigger={image ? 'view-attached-image' : undefined}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton fill="clear" onClick={() => imageModal.current?.dismiss()}>
                  <IonIcon src={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {image && <IonImg src={URL.createObjectURL(image!)} />}
          </IonContent>
          <IonFooter>
            <IonToolbar className='ion-padding'>
              <IonButton
                shape="round"
                expand="block"
                onClick={() => imageModal.current?.dismiss()}
                color="medium"
              >
                Close
              </IonButton>
            </IonToolbar>
          </IonFooter>
        </IonModal>
      </IonContent>
      <IonFooter>
        <IonToolbar className="p-3">
          <IonButton
            shape="round"
            className="font-poppins font-bold"
            expand="block"
            onClick={handleSubmit(handlePost, handleError)}
          >
            {posting ? (
              <IonSpinner name="dots" />
            ) : (
              <IonText>Post</IonText>
            )}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage >
  )
}

export default GroupCreateNewPost