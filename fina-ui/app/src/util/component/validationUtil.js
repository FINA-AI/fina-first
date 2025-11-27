const containsLetters = (value) => {
  return /[a-zA-Z]/.test(value);
};

const containsUpperCase = (value) => {
  return /[A-Z]/.test(value);
};

const containsNumbers = (value) => {
  return /[0-9]/.test(value);
};

const containsSpecChars = (value) => {
  return /[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g.test(value);
};

export const userLoginPattern =
  /^(?=.{1,50}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9][a-zA-Z0-9_.-]*[a-zA-Z0-9]$/;

export const validateUserLogin = (login) => {
  return userLoginPattern.test(login);
};

export const validateEmail = (config, email) => {
  if (!email) {
    return true;
  }
  email = email.trim().toLowerCase();
  const getNotAllowedEmailDomains = () => {
    const allowedDomainsString =
      config.properties["net.fina.blocked.email.domains"];
    return allowedDomainsString ? allowedDomainsString.split(";") : [];
  };
  const notAllowedEmailDomains = getNotAllowedEmailDomains().map((v) =>
    v.trim().toLowerCase()
  );
  const emailRegex = /^(?!$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const emailDomain = email.split("@")[1];

  return (
    emailRegex.test(email) &&
    !Boolean(
      notAllowedEmailDomains.some(
        (domain) => emailDomain === domain || emailDomain.endsWith(domain)
      )
    )
  );
};

export const validatePassword = (config, password) => {
  const passwordPolicy = config.passwordPolicy;

  const getInvalidKey = (validatedPassword) => {
    let result = false;
    for (const [key, value] of Object.entries(validatedPassword)) {
      if (value === false) {
        result = key;
        break;
      }
    }
    return result;
  };

  const validatedPassword = {
    MINIMUM_LENGTH: password.length >= passwordPolicy.minLength,
    WITH_NUMS: passwordPolicy.numbers ? containsNumbers(password) : true,
    WITH_CHARS_UPPER: passwordPolicy.upperCase
      ? containsUpperCase(password)
      : true,
    WITH_CHARS: passwordPolicy.letters ? containsLetters(password) : true,
    WITH_SPECIAL_CHARACTERS: passwordPolicy.specialCharacters
      ? containsSpecChars(password)
      : true,
  };

  return getInvalidKey(validatedPassword) || false;
};
