import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HelpComponent } from './components/help/help.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent, title: 'Home' },
	{ path: 'about', component: AboutComponent, title: 'About' },
	{ path: 'contact', component: ContactComponent, title: 'Contact' },
	{ path: 'help', component: HelpComponent, title: 'Help' }
];
