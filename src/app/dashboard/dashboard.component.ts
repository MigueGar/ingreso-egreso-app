import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs!: Subscription
  ingresosSubs!: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
    .pipe(
      filter(auth => auth.user != null)
    )
    .subscribe(({user}) => {
        this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user?.uid!)
          .subscribe(ingresosEgresosFB => {
            this.store.dispatch(setItems({items: ingresosEgresosFB}));
          });

      });

  }

  ngOnDestroy(): void {
    this.ingresosSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }

}
