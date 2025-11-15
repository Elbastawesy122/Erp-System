export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  isAdmin?: boolean;
}

export interface isValid {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface loginRequest {
  email: string;
  password: string;
}

export interface orderRequest {
  id?: number;
  customerName: string;
  dueDate: string;
  status: string;
  progress?: string;
  createdById?: number;
  acceptedById?: number;
  material: {
    id?: number;
    materialName: string;
    quantity: number;
    price?: number;
  }[];
}

export interface storeRequest {
  id?: number;
  name: string;
  quantity: number;
}

export interface requestRequest {
  id?: number;
  title: string;
  description: string;
  status?: string;
  createdById?: number;
  materials: {
    materialName: string;
    quantity: number;
    price?: number;
  }[];
  createdBy?: {
    id: number;
    name: string;
  };
}

export interface chartDataRequest {
  name: string;
  totalOrders: number;
  completedOrders: number;
}
