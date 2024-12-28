export class Constante {

  static ACCION_FORM_NEW = "NEW";
  static ACCION_FORM_EDIT = "EDIT";
  static ACCION_FORM_VIEW = "VIEW";
  static ACCION_LIST = "LIST";

  static DIALOG_STATUS_OK = 1;
  static DIALOG_STATUS_CANCEL = 2;

  static TIPO_MENU_GRUPO = 1;
  static TIPO_MENU_BASIC = 2;
  static TIPO_MENU_COLLAPSABLE = 3;
  static TIPO_MENU_DIVIDER = 4;

  static STATUS_OK = 1;
  static STATUS_ERROR = 0;

  static CITACION_PUBLICADO = 1;
  static CITACION_NO_PUBLICADO = 0;

  static PAGINATION_SIZE = 5;
  static PAGINATION_SIZE_OPTIONS = [5, 10, 15];

  //Parámetros de configuracion
  static INFO_USER = "info-user";
  static PERFIL_USER = "perfil-user";
  static MENU_APP = "menu-app";

  static TOKEN_APP = "token";
  static TOKEN_IDENTITY = "identity";
  static MESSAGE_ERROR_SERVER = "Error al intentar conectarse con el servidor";

  static MESSAGE_TITLE_SUCCESS = "Exito";
  static MESSAGE_TITLE_WARNING = "Advertencia";
  static MESSAGE_TITLE_ERROR = "Error";
  static MESSAGE_TITLE_INFO = "Informativo";

  //#region parametros de configuracion
  static TIPO_PERFIL = 1;

  static TIPO_NOR_NORMATIVA = 1;
  static TIPO_NOR_GUIA = 2;
  static TIPO_NOR_PROYECTO = 3;

  static FILTER_ULT_24H = 1;
  static FILTER_ULT_WEEK = 2;
  static FILTER_ULT_MONTH = 3;
  static FILTER_ULT_YEAR = 4;
  //#endregion

  //#region Rutas de Usuario
  static URL_PDF_VIEW = "/pdfvisor";
  static URL_USER_FAVORITOS = "/favoritos";
  static URL_USER_NORMATIVAS = "/normativas";
  static URL_USER_GUIAS = "/guias";
  static URL_USER_PROYECTOS = "/proyectos";
  //#endregion

  //#region Rutas de Administracion
  static URL_DASHBOARD = "/";
  static URL_DASHBOARD_HOME = "inicio";

  static URL_PERFIL_SELECCIONAR = "perfil/seleccionar-perfil";
  static URL_PERFIL_CAMBIAR = "perfil/cambiar-perfil";
  static URL_BUSQUEDA_AVANZADA = "busqueda-avanzada";


  static URL_LOGIN = "login";
  static URL_IDENTITY_DASHBOARD_HOME = "";
  static URL_IDENTITY_LOGIN = "login";
  static URL_IDENTITY_SIGN_OUT = "signout";

  static URL_ADM_NORMATIVA_REG = "/adm/normativas/registrar";
  static URL_ADM_NORMATIVA_ACT = "/adm/normativas/editar";
  static URL_ADM_NORMATIVA_LIST = "/adm/normativas/listar";

  static URL_ADM_TIPO_NORMATIVA_REG = "/adm/tipo-normativas/registrar";
  static URL_ADM_TIPO_NORMATIVA_ACT = "/adm/tipo-normativas/editar";
  static URL_ADM_TIPO_NORMATIVA_LIST = "/adm/tipo-normativas/listar";

  static URL_ADM_PERFIL_REG = "/adm/perfiles/registrar";
  static URL_ADM_PERFIL_ACT = "/adm/perfiles/editar";
  static URL_ADM_PERFIL_LIST = "/adm/perfiles/listar";

  static URL_ADM_REPORTE_REG = "/adm/reporte/registrar";
  static URL_ADM_REPORTE_ACT = "/adm/reporte/editar";
  static URL_ADM_REPORTE_LIST = "/adm/reporte/listar";

  static TOTAL_REGISTROS = 50;
  static COD_PERFIL_ADMINISTRADOR = 10;
  //#endregion
}
