import { IonCard, IonIcon, IonText, useIonRouter } from "@ionic/react";
import { peopleCircleOutline, personCircleOutline } from "ionicons/icons";
import { isValidUrl } from "../../utils/ValidUrl";
import { RecommendGroupType } from "../../services/recommend";
import { formatYearLevel } from "../../pages/Recommend/RecommendStudents";
import { memo } from "react";

const RecommendedGroupCard = (props: { group: RecommendGroupType }) => {
  const rt = useIonRouter();
  const handleClick = () => {
    rt.push("/group/vu/" + props.group.vanity_id);
  };

  return (
    <IonCard className="m-0 w-full ion-padding" onClick={handleClick}>
      <div className="flex justify-center py-8 bg-slate-300 rounded-lg h-36">
        {props.group.avatar_url && isValidUrl(props.group.avatar_url + "") ? (
          <img
            className="rounded-full w-[80px] h-auto mx-auto"
            src={props.group.avatar_url!}
          />
        ) : (
          <IonIcon className="text-8xl" src={peopleCircleOutline}></IonIcon>
        )}
      </div>
      <div>
        <IonText>
          <h6 className="font-bold font-poppins">
            {props.group.name}
          </h6>
          {props.group.courseContent && (
            <p className="mt-[-10px]">
              {props.group.courseContent.title.replace("B.S. in", "")}
            </p>
          )}
          <div>
            {props.group.semester && (
              <span>{formatYearLevel(props.group.semester)} Year</span>
            )}
            {/* {props.group.type === "regular" && props.group.block && (
              <span>
                {" | "}
                {props.group.block}
              </span>
            )}
            {props.group.type === null && <span>{" | "}Irregular</span>} */}
          </div>
        </IonText>
      </div>
    </IonCard>
  );
};

export default memo(RecommendedGroupCard);
