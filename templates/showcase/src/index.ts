import { AppRoot, ChangeDetector, Helpers, Router, ElementManipulations, IContext, Component, EventDispatcher, Detector, Aspect  } from 'nubond';

import { TemplatesProvider } from './shared/templates/templates-provider';
import { Tooltip } from './shared/aspects/tooltip';
import { DateFormat } from './shared/extenders/date-format';

import { BaseTabContainer } from './pages/base-tab-container';
import { Basics } from './pages/basics/basics';
import { Containers } from './pages/containers/containers';
import { Components } from './pages/components/components';
import { Extenders } from './pages/extenders/extenders';
import { DependencyInjections } from './pages/dependency-injections/dependency-injections';
import { Routing } from './pages/routing/routing';
import { ExecutionExpressions } from './pages/execution-expressions/execution-expressions';
import { Integrations } from './pages/integrations/integrations';

TemplatesProvider.defineTemplates();

@AppRoot({ 
    showDebugInfo: true,
    //complyWithW3C: true,
},
'/#[tab=basics]',
Basics, Containers, Components, Extenders, 
DependencyInjections, Routing, ExecutionExpressions, Integrations,
Tooltip, DateFormat)
export class App {
    public inOutComponentInput: string | undefined = '123';
    public inOutComponentOutput: number | undefined;

    private _currentContainerContext: BaseTabContainer | undefined;

    public changeDetectionManualTriggerCount: number = 0;
    public forceChangeDetection: boolean = true;

    public modals = { settingsIsOpen: false, linksIsOpen: false };

    constructor(public router: Router, changeDetector: ChangeDetector) {
        router.onAfterStateChange((oldState: {[key: string]: string | undefined}, newState: {[key: string]: string | undefined}, oldPath: string, newPath: string) => {
            console.log(`Routed to '${newPath}' with state '${Helpers.stringify(newState)}'`);
        });
    }

    //refresh
    public triggerChangeDetection(element: ElementManipulations, event: Event): void {
        event.preventDefault();

        this.changeDetectionManualTriggerCount++;
        this._currentContainerContext!.detectChanges();
        
        element.classes.add('animate__rotateOut');
        setTimeout(() => {
            element.classes.add('animate__rotateIn');
            element.classes.remove('animate__rotateOut');
            
            setTimeout(() => {
                element.classes.remove('animate__rotateIn');
            }, 500);
        }, 500)
    }

    public onContainerAttached(context: IContext): void {
        this._currentContainerContext = <BaseTabContainer>context;
        console.log(`Container context '${context.constructor.name}' attached`);
    }

    public onContainerDetached(context: IContext): void {
        console.log(`Container context '${context.constructor.name}' detached`);
    }
}

// export class DataModel {
//     public textProp = '123';
//     public numProp = 123;
// }

// @Component(`
//     <test-comp2 nb-event:some-event="this.disp.dispatch('some-event', data)" nb-prop:data="this.data"></test-comp2>
//     <test-comp nb-event:some-event="this.disp.dispatch('some-event', data)" nb-prop:data="this.data"></test-comp>
// `)
// export class TestCompWrapper { 
//     private _data: DataModel | undefined;
//     public get data(): DataModel | undefined {
//         return this._data;
//     }
//     public set data(value: DataModel | undefined) {console.log(`wr: ${JSON.stringify(value)}`);
//         this._data = value;
//     }

//     constructor(public disp: EventDispatcher) { 

//     }
// }

// @Component('')
// export class TestComp2 { 
//     private _data: DataModel | undefined;
//     public get data(): DataModel | undefined {
//         return this._data;
//     }
//     public set data(value: DataModel | undefined) {console.log(`in2: ${JSON.stringify(value)}`);
//         this._data = value;

//         setInterval(() => console.log(`in2: ${JSON.stringify(value)}`), 1000);
//     }
// }

// @Component('')
// export class TestComp {
//     private _tick = false;

//     private _data = new DataModel();
//     public get data(): DataModel {
//         return this._data;
//     }
//     public set data(value: DataModel) {console.log(`in: ${JSON.stringify(value)}`);
//         this._data = value;

//        // setTimeout(() => console.log(`in: ${JSON.stringify(value)}`), 1000)
//     }

//     constructor(disp: EventDispatcher) {
//         setTimeout(() => {
//             console.log(`ev: ${JSON.stringify(this._data)}`);

//             disp.dispatch('some-event', this._data);

//             setTimeout(() => {
//                 this._data.textProp = '321'; 
//                 this._data.numProp = 321;
//                 this._tick = !this._tick;

//                 console.log(`eu: ${JSON.stringify(this._data)}`);
//                 console.log(`-------------------`);

//                 setTimeout(() => {
//                     this._data.textProp = '1'; 
//                     this._data.numProp = 1;
//                     this._tick = !this._tick;
//                     console.log(`eu2: ${JSON.stringify(this._data)}`);
//                 }, 1000);
//             }, 100);
//         }, 1000);
//     }
// }

// @Component('')
// export class TestComp3 {
//     private _data = new DataModel();
//     public set data(value: DataModel) {console.log(`in: ${JSON.stringify(value)}`);
//         this._data = value;

//        // setTimeout(() => console.log(`in: ${JSON.stringify(value)}`), 1000)
//     }

//     constructor(disp: EventDispatcher) {
//         setTimeout(() => {
//             console.log(`ev: ${JSON.stringify(this._data)}`);

//             console.log(Object.getOwnPropertyDescriptor(this, 'data'), `data`);

//             disp.dispatch('some-event', this._data);
//         }, 1000);
//     }
// }

// @Aspect()
// export class SomeAspect {
//     constructor() {
//         console.log('SomeAspect constructed');
//     }

//     public set data(value: any) {
//         console.log('SomeAspect constructed');
//     }
// }

/**
 * playground.html AppRoot
 */
// @AppRoot({ 
//     showDebugInfo: true,
// },
// '/#{tab=basics}',
// Basics, Containers, Components, Extenders, 
// DependencyInjections, Routing, ExecutionExpressions,
// Tooltip, DateFormat)
// export class PlaygroundApp {
//     // private _data: DataModel | undefined;
//     // public get data(): DataModel | undefined {
//     //     return this._data;
//     // }
//     // public set data(value: DataModel | undefined) {console.log(`pa: ${JSON.stringify(value)}`);
//     //     this._data = value;
//     // }

//     //index = 0;
//     routes = ['Basics', 'Containers', 'Components', 'Extenders', 'DependencyInjections', 'Routing', 'ExecutionExpressions'];

//     constructor(changeDetector: ChangeDetector, public router: Router) {
//         router.onBeforeStateChange((preventChange, oldState, newState, oldPath, newPath) => {
//             console.log('onBeforeStateChange', oldState, newState, oldPath, newPath);
//         });

//         router.onAfterStateChange((oldState, newState, oldPath, newPath) => {
//             console.log('onAfterStateChange', oldState, newState, oldPath, newPath);
//         });

//         //console.log('Go Containers');
//         //router.go('Basics');

//         setTimeout(() => {
//             console.log('goBack');
//             router.goTo(-1);
            
//             // console.log('Go Components');
//             // router.go('Components');

//             // setTimeout(() => {
//             //     console.log('goBack');
//             //     router.goTo(-1);
//             //     setTimeout(() => {
//             //         //router.goBack();
//             //         console.log('goForward');
//             //         router.goTo(+1);
//             //     }, 1000);
//             // }, 1000);
//         }, 1000);

//         // this.goForward();
//     }

//     // public goForward(): void {
//     //     if (this.index < this.routes.length) {
//     //         this.router.go(this.routes[this.index++]);
//     //         setTimeout(() => this.goForward(), 1000);
//     //     } else {
//     //         this.goBack();
//     //     }
//     // }

//     // public goBack(): void {
//     //     if (this.index > 0) {
//     //         this.router.goBack();
//     //         setTimeout(() => this.goBack(), 1000);
//     //     } else {
            
//     //     }
//     // }
// }

/**
 * performance.html AppRoot
 */
// @AppRoot()
// export class PerformanceTestApp {
//     private now: number | undefined;
//     public repeat = new Array<number>();

//     constructor(changeDetector: ChangeDetector) {
//         for (let index = 0; index < 100_000; index++) {
//             this.repeat.push(index);
//         }

//         setTimeout(() => {
//             this.repeat = [];
//             for (let index = 100_000 - 1; index >= 0 ; index--) {
//                 this.repeat.push(index);
//             }

//             console.log('repeat updated');
//             this.now = Date.now();
//             changeDetector.detect();
//         }, 10000);

//         console.log('repeat completed');
//         this.now = Date.now();
//     }

//     public onDetectChangesDone(): void {
//         console.log(`Detected in: ${(Date.now() - this.now!)}ms`)
//     };
// }