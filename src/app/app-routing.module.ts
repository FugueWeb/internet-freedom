import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IFComponent }   from './if/if.component';
//import { IFDetailComponent }   from './if-detail/if-detail.component';
import { AboutComponent }      from './about/about.component';
import { PageNotFoundComponent }      from './page-not-found/page-not-found.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/if',
		pathMatch: 'full'
	},
	{
		path: 'if',
		component: IFComponent,
		data: {title: "Home | Internet Freedom"}
	},
	{
		path: 'about',
		component: AboutComponent,
		data: {title: "About | Internet Freedom"}
	},
    {
		path: '**',
		component: PageNotFoundComponent,
		data: {title: "404 | Internet Freedom"}
	}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}