import {Inject, Injectable} from '@angular/core';
import {CONTACTS_CONFIG, ICountry} from '../circlecrm-auth.types';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {create_headers, json_decode, merge_url_fragments} from '@circlecrm/circlecrm-core';

@Injectable()
export class CirclecrmCountryService {

  protected baseUrl: string;

  private cache: ICountry[] = [];

  public constructor(@Inject(CONTACTS_CONFIG) configToken: any, protected http: HttpClient) {
    this.baseUrl = configToken as string;
  }

  public refresh(background?: boolean): Promise<ICountry[]> {
    this.cache = [];
    return this.doGetAll(background).toPromise();
  }

  public getAll(background?: boolean): Promise<ICountry[]> | ICountry[] {
    if (this.cache && this.cache.length > 0) {
      return this.cache;
    }

    return this.doGetAll(background).toPromise();
  }

  protected doGetAll(background?: boolean): Observable<ICountry[]> {

    return this.http.get(merge_url_fragments(this.baseUrl , 'utils/countries'),
      {observe: 'response', responseType: 'text', headers: create_headers(background)})
      .map((res: HttpResponse<string>) => {
        const result = json_decode<ICountry[]>(res.body || '');
        this.cache = result || [];
        return this.cache;
      });
  }

}
