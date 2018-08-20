import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../core';

@Component({
    selector: 'app-auth-template',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    isHome: boolean;
    isAdmin: boolean;
    isSignUpLogin: boolean;
    showHeader = true;
    showFooter: boolean;
    lastKnownScrollY: number;
    currentScrollY: number;
    ticking: number;
    navigationSubscription;
    @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
    isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
        .pipe(
            map(result => result.matches)
        );

    classes = {
        pinned: 'header-pin',
        unpinned: 'header-unpin',
    };
    eleHeader;
    @ViewChild('header', {
        read: ElementRef
    }) header: ElementRef;
    @ViewChild('sidenavcont', {
        read: ElementRef
    }) sidenavcont;
    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private userService: UserService,
        private route: ActivatedRoute
    ) {
        const me = this;
        let url = this.route.snapshot['_routerState'].url;
        url = url.split('/').slice(1).shift();
        this.setFlags(url);

        this.userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
            if (!this.isAdmin && this.showHeader) {
                console.log('attaching scroll event');
                document.addEventListener('scroll', () => this.scrollEvent(me), false);
                this.navBar();
            } else {
                console.log('detaching scroll event');
                document.removeEventListener('scroll', () => this.scrollEvent(me));
            }
        });
        this.navigationSubscription = this.router.events.subscribe((val) => {
            console.log('router event ', val);
            if (val instanceof NavigationEnd) {
                url = val.url.split('/').slice(1).shift();
                this.setFlags(url);
                if (!this.isAdmin && this.showHeader) {
                    this.navBar();
                }
            }
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
    ngAfterViewChecked() {
        this.eleHeader = this.header ? this.header.nativeElement : undefined;
        if (this.eleHeader) {
            this.navBar();
        }
    }
    ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we
        // don't then we will continue to run our initialiseInvites()
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }
    setFlags(url) {
        this.isHome = url === '';
        this.showHeader = !['login', 'register', 'admin'].includes(url);
        this.showFooter = !['login', 'register', 'admin'].includes(url);
        this.isSignUpLogin = ['login', 'register'].includes(url);

    }
    scrollEvent(me) {
        return me.onScroll(me);
    }
    navBar() {
        if (!document) {
            return;
        }
        const banner = document.querySelector('.banner-container');
        const tbar = this.eleHeader ? this.eleHeader.querySelector('mat-toolbar') : undefined;
        const sbar = document.querySelector('.search-bar-cont');
        if (this.isHome && this.showHeader) {
            const isVisible = this.isScrolledIntoView(banner);
            if (isVisible && tbar && sbar) {
                tbar.classList.remove('mat-primary');
                tbar.classList.add('bg-transparent');
                sbar.classList.add('hidden');
            } else if (!isVisible && tbar && sbar) {
                tbar.classList.add('mat-primary');
                tbar.classList.remove('bg-transparent');
                sbar.classList.remove('hidden');
            }
        } else if (!this.isHome && this.showHeader && tbar && sbar) {
            tbar.classList.remove('bg-transparent');
            tbar.classList.add('mat-primary');
            sbar.classList.remove('hidden');
        }
    }
    onScroll(scope) {
        scope.currentScrollY = window.pageYOffset;

        scope.navBar();
        scope.requestTick();
    }
    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.update(this);
            });
        }
        this.ticking = 1;
    }
    update(me) {
        if (me.currentScrollY < me.lastKnownScrollY) {
            me.pin();
        } else if (me.currentScrollY > me.lastKnownScrollY) {
            me.unpin();
        }
        me.lastKnownScrollY = me.currentScrollY;
        me.ticking = 0;
    }
    pin() {
        if (this.eleHeader && this.eleHeader.classList.contains(this.classes.unpinned)) {
            this.eleHeader.classList.remove(this.classes.unpinned);
            this.eleHeader.classList.add(this.classes.pinned);
        }
    }
    unpin() {
        if (
            this.eleHeader &&
            (this.eleHeader.classList.contains(this.classes.pinned) || !this.eleHeader.classList.contains(this.classes.unpinned))
        ) {
            this.eleHeader.classList.remove(this.classes.pinned);
            this.eleHeader.classList.add(this.classes.unpinned);
        }
    }
    isScrolledIntoView(el) {
        if (!el) {
            return;
        }
        const rect = el.getBoundingClientRect(),
            elemTop = rect.top,
            elemBottom = rect.bottom;

        // Only completely visible elements return true:
        // const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        // Partially visible elements return true:
        const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    }
}
