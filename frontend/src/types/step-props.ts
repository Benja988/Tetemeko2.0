export interface StepProps {
    step: number;
    onNext?: () => void;
    onBack: () => void;
    onSubmit?: () => void;
    formData: {
      name: string;
      email: string;
      phone: string;
      service: string;
      description: string;
      date: string;
      time: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
  }
  