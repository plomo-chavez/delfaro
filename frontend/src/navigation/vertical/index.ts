export default [
  {
    title: "Inicio",
    to: { name: "root" },
    icon: { icon: "tabler-smart-home" },
    config: { requiresAuth: true },
  },
  {
    title: "Administrador",
    icon: { icon: "tabler-settings" },
    children: [
      // 2nd level
      { title: "Compañias", to: { name: "catalogos-companias" } },
      {
        title: "Usuarios",
        to: { name: "usuarios" },
      },
      {
        title: "Catalogos",
        children: [
          // 3rd level
          {
            title: "Actividades",
            to: { name: "catalogos-actividades" },
            // config: { requiresAuth: true },
          },
          {
            title: "Estatus de clientes",
            to: { name: "catalogos-estatus-clientes" },
          },
          { title: "Método de pago", to: { name: "catalogos-metodo-pago" } },
          { title: "Ramos", to: { name: "catalogos-ramos" } },
          {
            title: "Tipos de vencimiento",
            to: { name: "catalogos-tipos-vencimiento" },
          },
          {
            title: "Tipos de usuarios",
            to: { name: "catalogos-tipos-usuarios" },
          },
        ],
      },
    ],
  },
  {
    title: "Cotizaciones",
    to: { name: "cotizaciones" },
    icon: { icon: "tabler-calendar" },
    meta: { requiresAuth: true },
  },
  {
    title: "Polizas",
    to: { name: "polizas" },
    icon: { icon: "tabler-books" },
  },
  {
    title: "Clientes",
    to: { name: "clientes" },
    icon: { icon: "tabler-users" },
  },
  {
    title: "Agentes",
    to: { name: "agentes" },
    icon: { icon: "tabler-users" },
  },
  // {
  //   title: "Agenda",
  //   to: { name: "agenda" },
  //   icon: { icon: "tabler-calendar" },
  // },
];
