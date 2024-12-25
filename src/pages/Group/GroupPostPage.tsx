import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  createAnimation,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonProgressBar,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
  Animation,
  IonSkeletonText
} from "@ionic/react";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "react-router";
import {
  chatboxOutline,
  heartOutline,
  sendSharp,
  shareSocialOutline,
} from "ionicons/icons";
import {
  getGroupPostById,
  getGroupPostCommentsByPostId,
} from "../../services/group/post";
import { object, string } from "yup";

import GroupPostComment from "./GroupPostComment";
import { SortOptions } from "../../enums";
import client from "../../client";
import useHideTabs from "../../hooks/useHideTabs";
import { useQuery } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import useSelfStudentLite from "../../hooks/me/useSelfStudentLite";

type GroupPostPageParams = {
  vanity_url: string;
  post_id: string;
};

const GroupPostPage: FC<RouteComponentProps<GroupPostPageParams>> = ({
  match,
}) => {
  console.log(match);
  const rt = useIonRouter();
  useHideTabs();

  const { vanity_url, post_id } = match.params;

  useEffect(() => {
    console.log("vanity_url:", vanity_url);
    console.log("post_id:", post_id);
  }, [vanity_url, post_id]);

  const pquery = useQuery({
    queryKey: ["group_post", post_id],
    queryFn: async () => {
      const res = await getGroupPostById(post_id);
      console.log("Post:", res.data);
      return res.data;
    },
    enabled: post_id !== undefined,
  });

  const [toast] = useIonToast();
  const handleShare = async () => {
    // share the url of this post
    // along with short snippet of the content
    // and the title of the post
    const title = pquery.data?.title + "";
    const content = pquery.data?.content!.substring(0, 100) + "...";
    const url = window.location.href;

    if ((await Share.canShare()).value) {
      await Share.share({
        title: title,
        text: content,
        url: url,
        dialogTitle: "Share this post",
      });
    } else {
      // share is not available
      // construct a text to copy to clipboard
      // with the title, content, and url
      const text = `${title}\n\n${content}\n\n${url}`;

      // detect if we're on web
      // if we are, then copy to clipboard
      if (!Capacitor.isNativePlatform()) {
        // copy to clipboard
        const clipRes = await navigator.clipboard.writeText(text);
        
        // alert the user that the text has been copied
        toast({
          message: "Post link has been copied to clipboard",
          duration: 2000,
        })
      }
    }
  };

  const timestamp = useMemo(() => {
    if (pquery.data?.created_at) {
      return new Date(pquery.data?.created_at!);
    } else {
      return new Date();
    }
  }, [pquery.data?.created_at]);

  const formattedContent = pquery.data?.content?.replace(/\n/g, "<br />");

  const modal = useRef<HTMLIonModalElement>(null);
  const [sortedBy, setSortedBy] = useState(() => SortOptions.NEWEST);
  const cquery = useQuery({
    queryKey: ["comments, post_id:", pquery.data?.group_id, sortedBy],
    queryFn: async () => {
      const res = await getGroupPostCommentsByPostId(
        pquery.data!.id + "",
        sortedBy === SortOptions.NEWEST ? true : false
      );
      console.log("group post comments: ", res.data);
      return res.data;
    },
    enabled: !!pquery.data,
  });

  const [posting, setPosting] = useState(() => false);
  const {
    setValue,
    control,
    handleSubmit,
    setError,
    clearErrors,
    getFieldState,
    formState: { errors },
  } = useForm<{ comment: string }>({
    resolver: yupResolver(
      object().shape({
        comment: string().required("Comment cannot be empty!"),
      })
    ),
  });

  const { student, profile } = useSelfStudentLite();
  const handlePostComment: SubmitHandler<{ comment: string }> = async (
    data
  ) => {
    setPosting(() => true);
    clearErrors("comment");

    // check if the comment's empty
    if (data.comment.length === 0) {
      setError("comment", {
        type: "custom",
        message: "You must fill up this input",
      });
      return;
    }

    try {
      // post the new comment
      // check if the student is a member of the group
      const isMember = await client
        .from("group_members")
        .select("*")
        .eq("group_id", pquery.data!.group_id)
        .eq("student_id", student!.id)
        .single();

      // if the student is not a member of the group
      // but the group is a public group for the university
      // then add the student to the group

      if (!isMember.data && pquery.data!.groups!.admin_uni_group) {
        // the student is not a member of the group
        // but the group is a public group for the university
        // so add the student to the group
        console.log("student is not a member, but the group is a public group");
        console.log("adding student to the group");

        const newGroupMember = await client
          .from("group_members")
          .insert({
            group_id: pquery.data!.group_id,
            student_id: student!.id!,
            profile_id: student!.profile_id!,
          })
          .select("*")
          .single();

        if (!newGroupMember.data) {
          console.log("Error joining group");
          console.log(newGroupMember.error);
          setPosting(() => false);
          return;
        }

        // joining the group was successful
        // now post the comment

        const res = await client
          .from("group_comments")
          .insert({
            post_id: pquery.data!.id!,
            member_id: newGroupMember.data.id!,
            student_id: student!.id!,
            content: data.comment!,
          })
          .select("*")
          .single();

        if (!res.data) {
          console.log("Error posting comment");
          console.log(res.error);
          setPosting(() => false);
          return;
        }

        // posting the comment was successful
        // refetch the latest comments
        await pquery.refetch();
        setPosting(() => false);

        // clear the comment box
        setValue("comment", "");
      } else {
        // the student is already a member of the group
        // assign the newGroupMember variable
        // to the isMember variable
        console.log("student is already a member of the group");
        console.log("posting comment");

        const res = await client
          .from("group_comments")
          .insert({
            post_id: pquery.data!.id!,
            member_id: isMember.data?.id!,
            student_id: student!.id!,
            content: data.comment!,
          })
          .select("*")
          .single();

        if (!res.data) {
          console.log("Error posting comment");
          console.log(res.error);
          setPosting(() => false);
          return;
        }

        // posting the comment was successful
        setPosting(() => false);

        // clear the comment box
        setValue("comment", "");

        // refetch the comments
        await cquery.refetch();
      }
    } catch {
      setError("comment", {
        type: "custom",
        message: "Error posting comment",
      });
      console.log("Error posting comment");
      setPosting(() => false);
    }
  };

  const [hasImageLoaded, setHasImageLoaded] = useState(false);
  const imgEl = useRef<HTMLIonImgElement | null>(null);
  const animation = useRef<Animation | null>(null);
  useEffect(() => {
    if (animation.current === null) {
      animation.current = createAnimation()
        .addElement(imgEl.current!)
        .duration(300)
        .fromTo("opacity", "0", "1")
    }
  }, [imgEl])
  const handleImgLoad = () => {
    setHasImageLoaded(true);
    if (animation.current !== null) {
      animation.current.play();
    }
  }

  return (
    <IonPage>
      <IonContent>
        <IonHeader collapse="condense" className="px-2 pt-2">
          <IonToolbar className="px-3">
            <IonButtons slot="start">
              <IonBackButton
                defaultHref={"/" + rt.routeInfo.pathname.split("/")[1]}
                text={""}
              />
            </IonButtons>
            <IonButtons slot="end">
              <IonButton className="ml-4" disabled>
                <IonIcon icon={heartOutline} />
              </IonButton>
              <IonButton className="ml-4" onClick={handleShare}>
                <IonIcon icon={shareSocialOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonCard className="rounded-3xl p-6 mx-[-3px] mt-0 shadow-none" color="light">
          <IonCardSubtitle>{pquery.data?.groups?.name}</IonCardSubtitle>
          <IonCardTitle className="text-lg font-poppins">
            {pquery.data?.title}
          </IonCardTitle>
          <IonCardSubtitle className="mt-2">
            {timestamp.toDateString()} {timestamp.getHours()}:
            {timestamp.getMinutes()}
          </IonCardSubtitle>
          {/* TODO: Display the user that posted it here */}
          {pquery.data?.image_url && <IonImg ref={imgEl} src={pquery.data?.image_url} onIonImgDidLoad={handleImgLoad} />}
          {pquery.data?.image_url && <IonSkeletonText animated className="h-[225px] w-full rounded-md" style={{ display: hasImageLoaded ? "none" : "block" }} />}
          {pquery.data?.content && (
            <IonCardContent className="px-0 pb-0 font-poppins">
              <IonText>
                <p dangerouslySetInnerHTML={{ __html: formattedContent! }}></p>
              </IonText>
            </IonCardContent>
          )}
        </IonCard>
        <IonRow className="p-4">
          <IonCol className=" flex items-center mt-0 justify-start py-0">
            <IonIcon src={chatboxOutline} className="text-xl" />{" "}
            <IonText className="ml-2">{cquery.data?.length ?? "-"}</IonText>
          </IonCol>
          <IonCol className="flex items-center justify-end">
            {/* <IonSelect value={sortedBy} interface="popover" onIonChange={(e) => setSortedBy(e.detail.value)}>
              <IonSelectOption value={SortOptions.NEWEST}>
                {SortOptions.NEWEST}
              </IonSelectOption>
              <IonSelectOption value={SortOptions.OLDEST}>
                {SortOptions.OLDEST}
              </IonSelectOption>
            </IonSelect> */}
          </IonCol>
        </IonRow>
        {cquery.data && cquery.data.length > 0 && (
          <IonCard className="rounded-3xl mt-0 p-6 mx-[-3px] mb-6 shadow-none" color="light">
            {cquery.data.map((comment) => (
              <GroupPostComment
                key={comment.id}
                student={comment.students!}
                comment={comment}
              />
            ))}
          </IonCard>
        )}
      </IonContent>

      <IonFooter>
        {posting && <IonProgressBar type="indeterminate" />}
        <IonGrid className="p-0">
          <IonToolbar className="px-4 pt-2">
            <Controller
              render={({ field }) => (
                <IonTextarea
                  className={`${getFieldState("comment").error
                      ? "ion-touched ion-invalid border-red-500"
                      : ""
                    } text-sm`}
                  disabled={posting}
                  value={field.value}
                  onIonChange={(e) => setValue("comment", e.detail.value ?? "")}
                  autoGrow
                  placeholder="Write a comment"
                  errorText={getFieldState("comment").error?.message}
                />
              )}
              control={control}
              name="comment"
            />
          </IonToolbar>
          <IonToolbar>
            {/* <IonButton
              className="font-poppins font-bold"
              size="small"
              fill="clear"
              id="group_rules"
            >
              Rules
            </IonButton> */}
            <IonButton
              slot="end"
              disabled={posting}
              size="small"
              fill="clear"
              onClick={handleSubmit(handlePostComment)}
            >
              <IonIcon src={sendSharp} slot="end"></IonIcon>
            </IonButton>
          </IonToolbar>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default GroupPostPage;
