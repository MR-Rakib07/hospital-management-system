export interface FormInputType {
  label: string;
  name?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  className?: string
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}