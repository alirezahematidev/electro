import cors, { CorsOptions } from "cors";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestDelayPathOptions<Name extends string> = {
  [name in Name]?: number;
};

type RequestDelayOptions<Name extends string> = {
  [method in RequestMethod]?: number | RequestDelayPathOptions<Name>;
};

type RequestThrowPathConfig = {
  throwsOn?: RequestMethod | Array<RequestMethod>;
  statusCode?: number;
  message: string;
};

type RequestThrowOption<Name extends string> = {
  [name in Name]?: RequestThrowPathConfig;
};

type RequestCustomHeaderOptions<Name extends string> = {
  [name in Name]?: Record<string, any>;
};

interface RequestOptions<Name extends string> {
  enabled?: boolean;
  host?: string;
  port?: number;
  cors?: CorsOptions;
  headers?: RequestCustomHeaderOptions<Name>;
  throwOptions?: RequestThrowOption<Name>;
  delayInMillis?: number | RequestDelayOptions<Name>;
}

let app: import("express").Express | undefined = undefined;

async function runServer<Name extends string>(options?: RequestOptions<Name>) {
  const { default: express } = await import("express");

  if (!app) app = express();

  options = options ?? {};

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors(options.cors ?? {}));

  const PORT = options.port || 5006;

  const HOST = options.host || "localhost";

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running at host:%s and port:%s...`, HOST, PORT);
  });

  server.on("error", (err) => {
    console.error(err.message);
  });

  process.on("SIGINT", () => {
    console.log("Closing server...");

    server.close((err) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      console.log("Server is closed successfully.");
      process.exit(0);
    });
  });
}

export { runServer };
export type { RequestOptions };
