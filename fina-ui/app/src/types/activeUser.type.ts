export interface ActiveUserType {
  browserDetails: string;
  clientAppName: string;
  current: boolean;
  deviceCategory: string;
  host: string;
  language: {
    code: string;
    encoding: string;
    id: number;
    name: string;
  };
  login: string;
  name: string;
  osDetails: string;
  sessionCreateDate: number;
  sessionId: string;
}
