export const tabTheme = {
  base: "flex flex-col gap-4",
  tablist: {
    base: "relative flex",
    styles: {
      default: "overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-secondary",
    },
    tabitem: {
      base: "transition-all flex items-center justify-center p-2 px-3 text-xs text-main hover:text-secondary-500 uppercase font-bold disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 border-r-2 border-default last:border-none",
      styles: {
        default: {
          base: "rounded-none",
          active: {
            on: "text-secondary",
            off: "",
          },
        },
      },
    },
  },
  tabpanel: "w-full overflow-x-auto rounded-md",
};

export const datePickerTheme = {
  popup: {
    footer: {
      button: {
        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300",
        today: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600",
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          selected: "bg-blue-500 text-white hover:bg-blue-400",
        },
      },
    },
  },
};

export const inlineDatePickerTheme = {
  popup: {
    root: {
      inner: "shadow-none px-4",
    },
    footer: {
      button: {
        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300",
        today: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600",
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          selected: "bg-blue-500 text-white hover:bg-blue-400",
        },
      },
    },
  },
};

export const defaultTextTheme = {
  field: {
    input: {
      base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus:outline-none",
      withAddon: {
        on: "rounded-none",
        off: "rounded-none",
      },
      colors: {
        gray: "border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
      },
    },
  },
};
export const passwordFieldTheme = {
  field: {
    input: {
      base: "block w-full border-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus:outline-none focus:border-none",
      withAddon: {
        on: "rounded-none",
        off: "rounded-none",
      },
      colors: {
        gray: "border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
      },
    },
  },
};

export const mainButtonTheme = {
  base: "group flex items-stretch items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none",
  color: {
    light:
      "text-gray-900 bg-secondary border border-gray-300 enabled:hover:bg-secondary-hover text-white ring-0 focus:ring-0 focus:ring-none",
  },
  label:
    "ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-200 text-xs font-semibold text-cyan-800",
  pill: {
    off: "rounded-none",
    on: "rounded-full",
  },
};

export const lightButtonTheme = {
  base: "group flex items-stretch items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none",
  color: {
    light:
      "text-gray-900 bg-secondary border border-gray-300 enabled:hover:bg-secondary-hover text-white ring-0 focus:ring-0 focus:ring-none",
  },
  label:
    "ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-200 text-xs font-semibold text-cyan-800",
  pill: {
    off: "rounded-lg",
    on: "rounded-full",
  },
};
export const baseButtonTheme = {
  base: "group flex items-stretch items-center justify-center p-0.5 text-center font-bold relative focus:z-10 border-r-2 focus:outline-none focus:ring-0",
  color: {
    light: "bg-transparent text-main ring-0 ring-none outline-none focus:ring-0 focus:ring-none",
    gray: "",
  },
  label: "bg-black",
  pill: {
    off: "rounded-none",
  },
};
export const navbarTheme = {
  root: {
    base: "bg-white p-4 pb-2 md:pb-4 dark:border-gray-700 dark:bg-gray-800 sm:px-4 shadow-md",
  },
  collapse: {
    base: "w-full md:block md:w-auto animate-fade",
  },

  toggle: {
    base: "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-transparent hover:outline-none focus:outline-none focus:ring-0 focus:ring-none md:hidden",
  },
};
export const accordion = {
  root: {
    base: "divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700",
    flush: {
      off: "rounded-lg border",
      on: "border-b",
    },
  },
  content: {
    base: "p-5 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-900",
  },
  title: {
    arrow: {
      base: "h-6 w-6 shrink-0",
      open: {
        off: "",
        on: "rotate-180",
      },
    },
    base: "flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400",
    flush: {
      off: "hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800",
      on: "bg-transparent dark:bg-transparent",
    },
    heading: "",
    open: {
      off: "",
      on: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white",
    },
  },
};
