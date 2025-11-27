import { Box } from "@mui/material";
import React from "react";

interface PasswordDetailsProps {
  passwordDetailsButton(name: string, fieldName: string): JSX.Element;
}

const PasswordDetails: React.FC<PasswordDetailsProps> = ({
  passwordDetailsButton,
}) => {
  return (
    <Box
      display={"flex"}
      flexWrap={"wrap"}
      pt={"8px"}
      data-testid={"password-details"}
    >
      {passwordDetailsButton(
        "passwordNeverExpires",
        "fina2.security.passwordValidityPeriod"
      )}
      {passwordDetailsButton(
        "blockAccountAfterDefinedPeriodInactivity",
        "fina2.security.allowedAccountInactivityPerioed"
      )}
      {passwordDetailsButton(
        "passwordShouldsContainLetters",
        "fina2.security.passwordWithLetters"
      )}
      {passwordDetailsButton(
        "passwordShouldContainNumbers",
        "fina2.security.passwordWithNums"
      )}
      {passwordDetailsButton(
        "passwordShouldContainUpperCaseLetters",
        "fina2.security.passwordWithLettersUpperCase"
      )}
      {passwordDetailsButton(
        "passwordShouldContainSpecialCharacters",
        "fina2.security.passwordWithSpecialCharacters"
      )}
    </Box>
  );
};

export default PasswordDetails;
