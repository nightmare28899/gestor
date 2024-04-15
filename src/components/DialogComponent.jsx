import { ALERT_TYPE, Dialog} from "react-native-alert-notification";
const DialogComponent = ({
  dialogTitle,
  dialogMessage,
  dialogType,
  dialogButton,
}) => {
  const alertTypeDictionary = {
      success: ALERT_TYPE.SUCCESS,
      error: ALERT_TYPE.DANGER,
      warning: ALERT_TYPE.WARNING,
      info: ALERT_TYPE.INFO,
  };
  const handleDialog = () => {
    Dialog.show({
      type: alertTypeDictionary[dialogType],
      title: dialogTitle,
      textBody: dialogMessage,
      button: dialogButton,
    });
  }

  return handleDialog();
}
export default DialogComponent;