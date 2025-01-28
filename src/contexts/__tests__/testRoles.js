export const sampleRoles = [
  {
    role_name: "superadmin",
    role_description: "System administrator",
    status: "active",
    permissions: [
      {
        admin: {
          access: true,
          modules: {
            sites: {
              view: true,
              add: true,
              edit: true,
              delete: true,
            },
            analytics: {
              view: true,
              add: true,
              edit: false,
              delete: false,
            },
            users: {
              view: true,
              add: true,
              edit: true,
              delete: true,
            },
            roles: {
              view: true,
              add: true,
              edit: true,
              delete: true,
            },
          },
        },
        client: {
          access: true,
          modules: {
            planning: {
              view: true,
            },
            maps: {
              view: true,
            },
            audiences: {
              view: true,
            },
            campaign: {
              view: true,
            },
          },
        },
      },
    ],
  },
  {
    role_name: "admin",
    role_description: "Data platform administrator",
    status: "active",
    permissions: [
      {
        admin: {
          access: true,
          modules: {
            sites: {
              view: true,
              add: true,
              edit: false,
              delete: false,
            },
            analytics: {
              view: true,
              add: true,
              edit: false,
              delete: false,
            },
            users: {
              view: false,
              add: false,
              edit: false,
              delete: false,
            },
            roles: {
              view: false,
              add: false,
              edit: false,
              delete: false,
            },
          },
        },
        client: {
          access: true,
          modules: {
            planning: {
              view: true,
            },
            maps: {
              view: true,
            },
            audiences: {
              view: true,
            },
            campaign: {
              view: true,
            },
          },
        },
      },
    ],
  },
  {
    role_name: "customer",
    role_description: "Data platform customers",
    status: "active",
    permissions: [
      {
        admin: {
          access: false,
          modules: {
            sites: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
            analytics: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
            users: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
            roles: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
          },
        },
        client: {
          access: true,
          modules: {
            planning: {
              view: true,
            },
            maps: {
              view: true,
            },
            audiences: {
              view: true,
            },
            campaign: {
              view: true,
            },
          },
        },
      },
    ],
  },
  {
    role_name: "subscriber",
    role_description: "Data platform subscribers",
    status: "inactive",
    permissions: [
      {
        admin: {
          access: false,
          modules: {
            sites: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
            analytics: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
            users: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
            roles: {
              add: true,
              view: false,
              edit: false,
              delete: false,
            },
          },
        },
        client: {
          access: true,
          modules: {
            planning: {
              view: true,
            },
            maps: {
              view: true,
            },
            audiences: {
              view: true,
            },
            campaign: {
              view: false,
            },
          },
        },
      },
    ],
  },
];
