'use babel';

var creators = {
  createComposeFileSelectedAction: function createComposeFileSelectedAction(filePath, services, version) {
    return {
      type: "COMPOSE_FILE_SELECTED",
      filePath: filePath,
      services: services,
      version: version
    };
  },
  createServicesRefreshedAction: function createServicesRefreshedAction(services) {
    return {
      type: "SERVICES_REFRESHED",
      services: services
    };
  },
  createServiceStateChangedAction: function createServiceStateChangedAction(services) {
    return {
      type: "SERVICE_STATE_CHANGED",
      services: services
    };
  },
  createComposeFileAddedAction: function createComposeFileAddedAction(filePath, services, version) {
    return {
      type: "COMPOSE_FILE_ADDED",
      filePath: filePath,
      services: services,
      version: version
    };
  }
};

module.exports = creators;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvcmVkdXgvYWN0aW9ucy9zZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7O0FBRVgsSUFBSSxRQUFRLEdBQUc7QUFDWixpQ0FBK0IsRUFBRSx5Q0FBUyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUNyRSxXQUFPO0FBQ0wsVUFBSSxFQUFFLHVCQUF1QjtBQUM3QixjQUFRLEVBQVIsUUFBUTtBQUNSLGNBQVEsRUFBUixRQUFRO0FBQ1IsYUFBTyxFQUFQLE9BQU87S0FDUixDQUFDO0dBQ0g7QUFDRCwrQkFBNkIsRUFBRSx1Q0FBUyxRQUFRLEVBQUU7QUFDaEQsV0FBTztBQUNMLFVBQUksRUFBRSxvQkFBb0I7QUFDMUIsY0FBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQztHQUNIO0FBQ0QsaUNBQStCLEVBQUUseUNBQVMsUUFBUSxFQUFFO0FBQ2xELFdBQU87QUFDTCxVQUFJLEVBQUUsdUJBQXVCO0FBQzdCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7R0FDSDtBQUNELDhCQUE0QixFQUFFLHNDQUFTLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ2xFLFdBQU87QUFDTCxVQUFJLEVBQUUsb0JBQW9CO0FBQzFCLGNBQVEsRUFBUixRQUFRO0FBQ1IsY0FBUSxFQUFSLFFBQVE7QUFDUixhQUFPLEVBQVAsT0FBTztLQUNSLENBQUM7R0FDSDtDQUNILENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiL1VzZXJzL21pbmdiby9jb25maWcvLmF0b20vcGFja2FnZXMvZG9ja2VyL2xpYi9yZWR1eC9hY3Rpb25zL3NlcnZpY2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxudmFyIGNyZWF0b3JzID0ge1xuICAgY3JlYXRlQ29tcG9zZUZpbGVTZWxlY3RlZEFjdGlvbjogZnVuY3Rpb24oZmlsZVBhdGgsIHNlcnZpY2VzLCB2ZXJzaW9uKSB7XG4gICAgIHJldHVybiB7XG4gICAgICAgdHlwZTogXCJDT01QT1NFX0ZJTEVfU0VMRUNURURcIixcbiAgICAgICBmaWxlUGF0aCxcbiAgICAgICBzZXJ2aWNlcyxcbiAgICAgICB2ZXJzaW9uXG4gICAgIH07XG4gICB9LFxuICAgY3JlYXRlU2VydmljZXNSZWZyZXNoZWRBY3Rpb246IGZ1bmN0aW9uKHNlcnZpY2VzKSB7XG4gICAgIHJldHVybiB7XG4gICAgICAgdHlwZTogXCJTRVJWSUNFU19SRUZSRVNIRURcIixcbiAgICAgICBzZXJ2aWNlczogc2VydmljZXNcbiAgICAgfTtcbiAgIH0sXG4gICBjcmVhdGVTZXJ2aWNlU3RhdGVDaGFuZ2VkQWN0aW9uOiBmdW5jdGlvbihzZXJ2aWNlcykge1xuICAgICByZXR1cm4ge1xuICAgICAgIHR5cGU6IFwiU0VSVklDRV9TVEFURV9DSEFOR0VEXCIsXG4gICAgICAgc2VydmljZXM6IHNlcnZpY2VzXG4gICAgIH07XG4gICB9LFxuICAgY3JlYXRlQ29tcG9zZUZpbGVBZGRlZEFjdGlvbjogZnVuY3Rpb24oZmlsZVBhdGgsIHNlcnZpY2VzLCB2ZXJzaW9uKSB7XG4gICAgIHJldHVybiB7XG4gICAgICAgdHlwZTogXCJDT01QT1NFX0ZJTEVfQURERURcIixcbiAgICAgICBmaWxlUGF0aCxcbiAgICAgICBzZXJ2aWNlcyxcbiAgICAgICB2ZXJzaW9uXG4gICAgIH07XG4gICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdG9ycztcbiJdfQ==