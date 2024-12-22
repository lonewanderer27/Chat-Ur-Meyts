import { useEffect, useRef, useState } from "react";
import { GroupPostType, GroupType } from "../../types";
import { createAnimation, IonCard, IonImg, IonSkeletonText, useIonRouter } from "@ionic/react";
import type { Animation } from "@ionic/react";

const UniversityPostCard = (props: {
  group?: GroupType;
  post?: GroupPostType;
  icon?: string;
}) => {
  const rt = useIonRouter();

  const handleClick = () => {
    console.log("clicked");
    rt.push(
      `/group/vu/${props.group?.vanity_id}/post/${props.post?.id}`,
      "forward",
      "replace"
    );
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
    <IonCard onClick={handleClick}>
      <IonImg ref={imgEl} src={props.post?.image_url + ""} onIonImgDidLoad={handleImgLoad} />
      <IonSkeletonText animated className="h-[225px] w-full my-[-2px]" style={{ display: hasImageLoaded ? "none" : "block" }} />
    </IonCard>
  );
};

export default UniversityPostCard;
