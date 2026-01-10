export type Member = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
  profile_image: string;
  gender: 'Male' | 'Female';
  nationality: string;
  date_of_birth: Date;
  martial_status: string;
  primary_email_address: string;
  personal_email_address: string;
  primary_phone_number: string;
}

export type Admin = {
  admin_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  gender: 'Male' | 'Female';
  profile_image: string;
  date_of_birth: Date;
  phone_number1: string;
  phone_number2: string;
  martial_status: string;
  primary_email_address: string;
  personal_email_address: string;
  primary_phone_number: string;
  contact: Contact;
}

export type Staff = {
  staff_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  gender: 'Male' | 'Female';
  profile_image: string;
  date_of_birth: Date;
  phone_number1: string;
  phone_number2: string;
  martial_status: string;
  primary_email_address: string;
  personal_email_address: string;
  primary_phone_number: string;
  contact: Contact;
}

export type Contact = {
  contact_id: string;
  primary_email_address: string;
  personal_email_address: string;
  primary_phone_number: string;
}