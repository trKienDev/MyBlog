import { ServerResponse } from 'http';

/**
 * Hàm gửi phản hồi thành công.
 * @param res - Đối tượng ServerResponse
 * @param statusCode - Mã trạng thái HTTP (200, 201, ...)
 * @param data - Dữ liệu phản hồi
 */
export const sendResponse = (res: ServerResponse, statusCode: number, data: any) => {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
};

/**
 * Hàm gửi phản hồi lỗi.
 * @param res - Đối tượng ServerResponse
 * @param statusCode - Mã trạng thái HTTP (400, 404, 500, ...)
 * @param error - Đối tượng lỗi hoặc thông báo lỗi
 */

export const sendError = (res: ServerResponse, statusCode: number, error: any) => {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(
                JSON.stringify({
                        message: error instanceof Error ? error.message : 'Unknown error occurred',
                        error,
                })
        );
};
