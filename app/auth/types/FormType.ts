export type FormInfoItem = {
  value?: string;
  errorMsg?: string;
}

export type FormInfo = {
  email: FormInfoItem;
  password: FormInfoItem;
  confirmPassword?: FormInfoItem;
}