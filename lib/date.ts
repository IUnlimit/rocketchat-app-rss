/**
 * 格式化日期时间字符串
 * @param date Date 对象
 * @returns 格式化后的日期时间字符串
 **/
export function formatDate(dateTime: number): string {
    if (dateTime == undefined) dateTime = 0;
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}