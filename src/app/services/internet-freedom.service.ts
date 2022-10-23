import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { environment } from 'src/environments/environment';
import { InternetFreedom } from '../models/internet-freedom';
import { NFT } from '../models/nft';
import { DebugService } from './debug.service';

@Injectable({ providedIn: 'root' })
export class InternetFreedomService {

    private internetFreedomUrl = 'api/internet_freedom';  // URL to in-memory-data-service api
    private nftUrl = 'api/nft';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient, private debugService: DebugService) { }

    /** GET InternetFreedom from the server */
    getInternetFreedom (): Observable<InternetFreedom[]> {
        return this.http.get<InternetFreedom[]>(this.internetFreedomUrl)
          .pipe(
            tap(_ => this.log('fetched InternetFreedom')),
            catchError(this.handleError<InternetFreedom[]>('getInternetFreedom', []))
          );
      }

    /** GET NFT from the server */
    getNFT (): Observable<NFT[]> {
        return this.http.get<NFT[]>(this.nftUrl)
          .pipe(
            tap(_ => this.log('fetched NFT')),
            catchError(this.handleError<NFT[]>('getNFT', []))
          );
      }

  /** GET evaluator by id. Return `undefined` when id not found */
  getIFNo404<Data>(id: number): Observable<InternetFreedom> {
    const url = `${this.internetFreedomUrl}/?id=${id}`;
    return this.http.get<InternetFreedom>(url)
      .pipe(
        map(internetFreedom => internetFreedom[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} org id=${id}`);
        }),
        catchError(this.handleError<InternetFreedom>(`getIF id=${id}`))
      );
  }

  /** GET evaluator by id. Will 404 if id not found */
  getIFDetail(id: string): Observable<InternetFreedom> {
    const url = `${this.internetFreedomUrl}/${id}`;
    return this.http.get<InternetFreedom>(url).pipe(
      tap(_ => this.log(`fetched evaluator id=${id}`)),
      catchError(this.handleError<InternetFreedom>(`getIF id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  /** Log a InternetFreedomService message with the DebugService */
  private log(message: string) {
    this.debugService.add(`InternetFreedomService: ${message}`);
  }
}
