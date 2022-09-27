export const isEmptyOrNil = (o: string): boolean => o === undefined || o.length === 0;

export const getIdFromPath = (originalUrl: string): string => {
  const list = originalUrl.split('/');
  return list.length > 2 ? list[list.length - 1] : '';
};

export const getAuditRoute = (originalUrl: string): string => originalUrl;

export const buildMessage = ({
  originalUrl,
  user,
  message,
  errorCode,
  method,
  severity,
}: {
  originalUrl: string;
  user: string;
  message: any;
  errorCode: number;
  method: string;
  severity: string;
}): string =>
  JSON.stringify({
    event: getAuditRoute(originalUrl),
    severity,
    user: user || '',
    path: originalUrl,
    errorCode,
    method,
    message,
  });

export const writeToErr = async (
  originalUrl: string,
  user: string,
  err: any,
  errorCode: number,
  method: string,
): Promise<void> => {
  const errorMessage = buildMessage({
    originalUrl,
    user,
    message: err,
    errorCode,
    method,
    severity: 'ERROR',
  });
  console.error(errorMessage);
};

export const writeToWarn = (
  originalUrl: string,
  user: string,
  warning: any,
  errorCode: number,
  method: string,
): void => {
  console.warn(
    buildMessage({
      originalUrl,
      user,
      message: warning,
      errorCode,
      method,
      severity: 'WARN',
    }),
  );
};

export const writeToLog = (originalUrl: string, user: string, log: any, errorCode: number, method: string): void => {
  console.log(
    buildMessage({
      originalUrl,
      user,
      message: log,
      errorCode,
      method,
      severity: 'INFO',
    }),
  );
};
