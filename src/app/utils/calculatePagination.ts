import { TOptions } from "../interface";

const calculatePagination = (options: TOptions) => {
    const { page, limit } = options;
    const pageNumber = Math.max(1, parseInt(page as string) || 1);
    const limitNumber = Math.max(1, parseInt(limit as string) || 10);
    const skip = (pageNumber - 1) * limitNumber;
    return { skip, limit: limitNumber, page: pageNumber };
}

export default calculatePagination;