export type Member = {
  member_id: string;
  auth_id: string;
  admin_id: string;
  staff_id: string;


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
  auth_id: string;
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

export type Permission = {
  permission_id: string;
  permission_name: string;
  code: string;
  module: string;
  description: string;
}

export type StaffWithPermissions = Staff & {
  permissions: Permission[];
}

export type Vendor = {
  vendor_id: string;
  vendor_name: string;
  contact_person: string;
  phone_number1: string;
  phone_number2: string;  
  vendor_email: string;
  vendor_image: string;
  source_link: string;
  vendortype: string;
  address: string;
  city: string;
  country: string;
  payment_terms: string;
  notes: string;
}