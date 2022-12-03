import fs from "fs";
import { createLogger, transports, format } from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = `${process.cwd()}/logs`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const now = new Date();
const logLevel = "info";

var logger = createLogger({
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  format: format.combine(
    format.prettyPrint(),
    format.timestamp({
      format: "DD-MM-YYYY hh:mm:ss A",
    }),
    format.printf((nfo) => {
      return `${nfo.timestamp} - ${nfo.level}: ${JSON.stringify(nfo.message)}`;
    })
  ),
  transports: [
    new transports.Console(),
    new winstonDaily({
      level: "info", // info 레벨에선
      datePattern: "YYYY-MM-DD", // 파일 날짜 형식
      dirname: logDir, // 파일 경로
      filename: `%DATE%.log`, // 파일 이름
      maxFiles: 30, // 최근 30일치 로그 파일을 남김
      zippedArchive: true, // 아카이브된 로그 파일을 gzip으로 압축할지 여부
    }),
    //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
    new winstonDaily({
      level: "error", // error 레벨에선
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // /logs/error 하위에 저장
      filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
  //* uncaughtException 발생시 파일 설정
  exceptionHandlers: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// Extend logger object to properly log 'Error' types
var origLog = logger.log;

logger.log = function (level, msg) {
  if (msg instanceof Error) {
    var args = Array.prototype.slice.call(arguments);
    args[1] = msg.stack;
    origLog.apply(logger, args);
  } else {
    origLog.apply(logger, arguments);
  }
};

export var log = logger;
export var stream = {
  write: function (message) {
    // winston과 morgan 적용시 출력되는 특수문자 'ESC[0m' 제거
    const purified_message = message.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
    logger.info(purified_message);
    console.log("message = ", purified_message);
  },
};
