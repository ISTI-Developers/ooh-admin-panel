export const roleTemplate = {
  role_name: "",
  role_description: "",
  status: "active",
  permissions: {
    admin: {
      access: false,
      modules: {
        sites: {
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        analytics: {
          view: false,
          add: false,
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
      access: false,
      modules: {
        planning: {
          view: false,
        },
        maps: {
          view: false,
        },
        audiences: {
          view: false,
        },
        campaign: {
          view: false,
        },
      },
    },
  },
};

export const userTemplate = {
  first_name: "",
  last_name: "",
  username: "",
  email_address: "",
  role: "",
  status: "active",
};

export const alertTemplate = {
  isOn: false,
  type: "info",
  message: "",
};
