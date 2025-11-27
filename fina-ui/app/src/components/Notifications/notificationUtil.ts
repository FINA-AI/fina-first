import { MessageReadStatus } from "../Messages/messageStatus";
import { CommunicatorStatusType } from "../../types/communicator.common.type";

export const getNotificationStatusStyle = (
  status: CommunicatorStatusType,
  lightMode: boolean
) => {
  switch (status) {
    case MessageReadStatus.SENT:
      return {
        backgroundColor: lightMode ? "#EBFFFC" : "#1849A9",
        color: lightMode ? "#00A388" : "#B2DDFF",
      };
    case MessageReadStatus.PENDING:
    case MessageReadStatus.CREATED:
      return {
        backgroundColor: lightMode ? "#ff8217" : "#DC6803",
        color: lightMode ? "#fff3d6" : "#FEF0C7",
      };
    case MessageReadStatus.INBOX:
      return {
        backgroundColor: lightMode ? "#FFF4E5" : "#B2DDFF",
        color: lightMode ? "#FF8D00" : "#1570EF",
      };
    case MessageReadStatus.READ:
      return {
        backgroundColor: lightMode ? "#FFF4E5" : "#079455",
        color: lightMode ? "#FF8D00" : "#ABEFC6",
      };
    case MessageReadStatus.REJECTED:
      return {
        backgroundColor: lightMode ? "#FFECE9" : "#B42318",
        color: lightMode ? "#FF4128" : "#FEE4E2",
      };
    case MessageReadStatus.PUBLISHED:
    case MessageReadStatus.OUTBOX:
      return {
        color: lightMode ? "#289E20" : "#B2DDFF",
        backgroundColor: lightMode ? "#E9F5E9" : "#1570EF",
      };
    default:
      return { backgroundColor: "#EBFFFC", color: "#00A388" };
  }
};
