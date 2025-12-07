import { Models } from "react-native-appwrite";

export interface MenuItem extends Models.Document {
  name: string;
  price: number;
  image_url: string;
  description: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
  store: {
    id: string;
    name: string;
    address: string;
  };
}

export interface Category extends Models.Document {
  name: string;
  description: string;
}

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  SHIPPER = "SHIPPER",
}

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface CartItemType {
  id: string; // menu item id
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  customizations?: CartCustomization[];
  store: {
    address: string;
    id: string;
    name: string;
  };
}

export interface CreateOrderRequest {
  items: {
    menuId: string;
    quantity: number;
  }[];
  latitude: number;
  longitude: number;
}

export interface OrderEntity {
  id: string;
  userId: string;
  items: CartItemType[];
  totalPrice: number;
  deliveryFee: number;
  latitude: number;
  longitude: number;
  status: string;
  paths: {
    lat: number;
    lon: number;
  }[];
  distance: number;
  deliveryCoord: {
    lat: number;
    lon: number;
  };
}

export interface CartStore {
  items: CartItemType[];
  orders: OrderEntity[];
  addItem: (item: Omit<CartItemType, "quantity">, quantity?: number) => void;
  removeItem: (id: string, customizations: CartCustomization[]) => void;
  increaseQty: (id: string, customizations: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations: CartCustomization[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchAllOrder: () => Promise<void>;
  createOrder: (
    data: CreateOrderRequest,
    onSuccess: VoidFunction
  ) => Promise<void>;
}

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

interface PaymentInfoStripeProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
}

interface CustomHeaderProps {
  title?: string;
}

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

interface CreateUserPrams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface GetMenuParams {
  category: string;
  query: string;
}
