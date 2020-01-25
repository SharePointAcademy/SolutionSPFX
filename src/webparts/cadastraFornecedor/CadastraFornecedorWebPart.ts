import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'CadastraFornecedorWebPartStrings';

import { sp, ItemAddResult } from "@pnp/sp";
import * as $ from "jquery";
import "jqueryui";
import "bootstrap";

require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');

export interface ICadastraFornecedorWebPartProps {
  description: string;
}

export default class CadastraFornecedorWebPart extends BaseClientSideWebPart <ICadastraFornecedorWebPartProps> {

  public onInit(): Promise<void> {
    
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {

    this.domElement.innerHTML = require("./template.html");

    document
        .getElementById("btnModal")
        .addEventListener("click", (e: Event) => $("#modalSucess").modal());
    
      document
      .getElementById("btnSalvar")
      .addEventListener("click", (e: Event) => this.adicionarFornecedor());        
    
  }

  protected listarFornecedores(): void{
    // get all the items from a list
    let htmlTable = "";

    sp.web.lists.getByTitle("Fornecedores").items.get().then((items: any[]) => {
      items.map( (item, key) => {
        htmlTable += `<tr>
                      <td>${item.ID}</td>
                      <td>${item.Title}</td>
                      <td>${item.Ativo}</td>
                    </tr>`;
      });
      $("#bodyContent").html(htmlTable);
      console.log(items);
    });
  }

  protected adicionarFornecedor(): void{

    sp.web.lists.getByTitle("Fornecedores").items.add({
      Title: $("#name").val(),
      Ativo: false
    }).then((iar: ItemAddResult) => {      
      console.log(iar);
      this.listarFornecedores();
      $("#modalSucess").modal('hide');
    },
    (err) => {
      console.log(err);
    });
  }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              })
            ]
          }
        ]
      }
    ]
  };
}
}
