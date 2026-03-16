import api from "../../components/api/axios";
import type { ICallHistory } from "./callTypes";

const getCallHistory = async (page = 1, limit = 30): Promise<{ calls: ICallHistory[]; total: number }> => {
    const response = await api.get(`/calls/history?page=${page}&limit=${limit}`);
    return response.data;
};

const callService = {
    getCallHistory,
};

export default callService;
