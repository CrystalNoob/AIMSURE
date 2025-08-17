export const bankLogoMap: { [key: string]: string } = {
  "Bank BCA": "/banks/BCA-1.png",
  "Bank BRI": "/banks/BRI-1.png",
  "Bank Mandiri": "/banks/Mandiri-1.png",
  "Bank BNI": "/banks/BNI-1.png",
  "Bank BSI": "/banks/BSI-1.png",
  "Bank BTN": "/banks/BTN-1.png",
};

export const getBankLogo = (bankName: string): string => {
  const foundKey = Object.keys(bankLogoMap).find((key) =>
    bankName.includes(key.split(" ")[1])
  );
  return foundKey ? bankLogoMap[foundKey] : "/logo/Logo AIMSURE 1.png";
};
