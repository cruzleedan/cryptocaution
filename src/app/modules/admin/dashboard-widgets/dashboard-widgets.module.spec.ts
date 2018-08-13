import { DashboardWidgetsModule } from './dashboard-widgets.module';

describe('DashboardWidgetsModule', () => {
  let dashboardWidgetsModule: DashboardWidgetsModule;

  beforeEach(() => {
    dashboardWidgetsModule = new DashboardWidgetsModule();
  });

  it('should create an instance', () => {
    expect(dashboardWidgetsModule).toBeTruthy();
  });
});
