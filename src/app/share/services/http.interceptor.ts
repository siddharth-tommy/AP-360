import { Injectable } from "@angular/core";
import {
  ConnectionBackend,
  RequestOptions,
  Request,
  RequestMethod,
  RequestOptionsArgs,
  Response,
  Http,
  Headers
} from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

//import { RequestMethod } from "@angular/http/src/enums";

@Injectable()
export class InterceptedHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    // url = environment.apiOrigin+ url;
    url = this.updateUrl(url);
    // var reqObj = this.getRequestOptionArgs(options);
    return super.get(url, this.getRequestOptionArgs(options, "Get"));
  }

  post(
    url: string,
    body: string,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    // url = this.updateUrl(url);
    url = environment.apiOrigin + url;
    //options.method = RequestMethod.Post;
    return super.post(url, body, this.getRequestOptionArgs(options, "Post"));
  }

  put(
    url: string,
    body: string,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    url = this.updateUrl(url);
    return super.put(url, body, this.getRequestOptionArgs(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.updateUrl(url);
    return super.delete(url, this.getRequestOptionArgs(options));
  }

  private updateUrl(req: string) {
    return environment.apiOrigin + req;
  }

  private getRequestOptionArgs(
    options?: RequestOptionsArgs,
    type?: string
  ): RequestOptionsArgs {
    if (options == null) {
      if (environment.apiOrigin.indexOf("localhost") > -1) {
        if (type == "Get")
          options = new RequestOptions().merge(
            new RequestOptions({ method: RequestMethod.Get })
          );
        else
          options = new RequestOptions().merge(
            new RequestOptions({ method: RequestMethod.Post })
          );
      } else options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
      options.headers.append("Content-Type", "application/json");
      if (localStorage.getItem("assetprotoken")) {
        options.headers.append(
          "Authorization",
          "Bearer" + " " + localStorage.getItem("assetprotoken")
        );
      }
    }
    return options;
  }
}
