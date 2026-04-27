import {allFinancialData} from "../../utils/getAllFinancialData";


export class AllFinancialStatistic {

    constructor(sideMenuInstance, openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("financialPage");
        }

        this.financialTable = document.getElementById("financial_statistic_table");
        this.deleteWindow = document.getElementById("deleteWindow");
        document.getElementById("incomeCreating").addEventListener("click", this.creatingNewFinanceOperation.bind(this, "income"));
        document.getElementById("expenseCreating").addEventListener("click", this.creatingNewFinanceOperation.bind(this, "expense"));




        this.renderTable(allFinancialData.getAllFinancialData());


    }

    renderTable(data) {
        data.forEach((item) => {
            const row = document.createElement("tr");
            const noCell = document.createElement("th");
            noCell.textContent = item.id;
            noCell.setAttribute("scope", "row");

            const typeCell = document.createElement("td");
            typeCell.textContent = item.type;
            if (item.type === 'доход') {
                typeCell.classList.add("text-success");
            } else if (item.type === 'расход') {
                typeCell.classList.add("text-danger");
            }

            const categoryCell = document.createElement("td");
            categoryCell.textContent = item.category;

            const amountCell = document.createElement("td");

            amountCell.textContent = item.amount.toLocaleString("ru-RU", {
                minimumFractionDigits: 0,
                style: "currency",
                currency: "USD",
            })

            const dateCell = document.createElement("td");
            dateCell.textContent = item.date.toLocaleDateString("ru-RU");

            const commentsCell = document.createElement("td");
            commentsCell.textContent = `${item.comments}`;

            const buttonsCells = document.createElement("td");
            buttonsCells.classList.add("d-flex", "justify-content-center", "align-items-center");

            const deleteButton = document.createElement("a");
            deleteButton.href = "javascript:void(0)";
            deleteButton.classList.add("pe-2");
            deleteButton.innerHTML = "<svg width=\"13\" height=\"15\" viewBox=\"0 0 13 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "                            <path d=\"M4 5.5C4.27614 5.5 4.5 5.72386 4.5 6V12C4.5 12.2761 4.27614 12.5 4 12.5C3.72386 12.5 3.5 12.2761 3.5 12V6C3.5 5.72386 3.72386 5.5 4 5.5Z\" fill=\"black\" />\n" +
                "                            <path d=\"M6.5 5.5C6.77614 5.5 7 5.72386 7 6V12C7 12.2761 6.77614 12.5 6.5 12.5C6.22386 12.5 6 12.2761 6 12V6C6 5.72386 6.22386 5.5 6.5 5.5Z\" fill=\"black\" />\n" +
                "                            <path d=\"M9.5 6C9.5 5.72386 9.27614 5.5 9 5.5C8.72386 5.5 8.5 5.72386 8.5 6V12C8.5 12.2761 8.72386 12.5 9 12.5C9.27614 12.5 9.5 12.2761 9.5 12V6Z\" fill=\"black\" />\n" +
                "                            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13 3C13 3.55228 12.5523 4 12 4H11.5V13C11.5 14.1046 10.6046 15 9.5 15H3.5C2.39543 15 1.5 14.1046 1.5 13V4H1C0.447715 4 0 3.55228 0 3V2C0 1.44772 0.447715 1 1 1H4.5C4.5 0.447715 4.94772 0 5.5 0H7.5C8.05229 0 8.5 0.447715 8.5 1H12C12.5523 1 13 1.44772 13 2V3ZM2.61803 4L2.5 4.05902V13C2.5 13.5523 2.94772 14 3.5 14H9.5C10.0523 14 10.5 13.5523 10.5 13V4.05902L10.382 4H2.61803ZM1 3V2H12V3H1Z\" fill=\"black\" />\n" +
                "                        </svg>"

            deleteButton.addEventListener("click", this.deleteOperation.bind(this, item.id));


            const editButton  = document.createElement("a");
            editButton.href = "javascript:void(0)";
            editButton.innerHTML = " <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "                            <path d=\"M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z\" fill=\"black\" />\n" +
                "                        </svg>"

            editButton.addEventListener("click", this.editOperation.bind(this, item.id, item.type));

            buttonsCells.appendChild(deleteButton);
            buttonsCells.appendChild(editButton);

            row.appendChild(noCell);
            row.appendChild(typeCell);
            row.appendChild(categoryCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(commentsCell);
            row.appendChild(buttonsCells);
            this.financialTable.appendChild(row);


        })


    }

    deleteOperation(id) {
        console.log("Delete operation", id);
        this.deleteWindow.style.display = "block";
        document.body.style.background = "rgba(0, 0, 0, 0.45)";
        document.getElementById("cancelDeleting").addEventListener("click", () => {
            this.deleteWindow.style.display = "none";
            document.body.style.background = "transparent";
        });

        document.getElementById("confirmDeleting").addEventListener("click", this.deleteOperationHttpRequest.bind(this, id));


    }

    deleteOperationHttpRequest(id) {
        this.deleteWindow.style.display = "none";
        document.body.style.background = "#fff";
        console.log("Deleting request to server", id)
    }

    creatingNewFinanceOperation(type) {
        //console.log("Creating new " + type);
        if (type === "income") {
            this.openNewRoute("/financial/create/income");
        } else if (type === "expense") {
            this.openNewRoute("/financial/create/expense");
        }

    }

    editOperation(id, type) {
        console.log("Editing financial operation " + id + type);
        if (type === "доход") {
            this.openNewRoute("/financial/edit/income?id=" + id);
        } else if (type === "расход") {
            this.openNewRoute("/financial/edit/expense?id=" + id);
        }

    }



}