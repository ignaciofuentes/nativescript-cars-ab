exports.data = {
    Categories: [
        {
            CategoryId: "C123450001",
            Label: "Vehicle Line",
            SequenceNo: 10,
            ZeroSelectable: "Yes",
            CategoryValues: [
                {
                    CVID: "CV2468001",
                    Label: "Fusion",
                    SequenceNo: 10,
                },
                {
                    CVID: "CV2468002",
                    Label: "Explorer",
                    SequenceNo: 15
                },
                {
                    CVID: "CV2468003",
                    Label: "Flex",
                    SequenceNo: 20
                }
            ]
        },
        {
            CategoryId: "C123450002",
            Label: "Model Year",
            SequenceNo: 15,
            ZeroSelectable: "No",
            CategoryValues: [
                {
                    CVID: "CV121212",
                    Label: "2016",
                    SequenceNo: 10
                },
                {
                    CVID: "CV212121",
                    Label: "2015",
                    SequenceNo: 15
                },
                {
                    CVID: "CV333333",
                    Label: "2015",
                    SequenceNo: 20
                }
            ]
        },
        {
            CategoryID: "C123450003",
            Label: "Transmission", 
            SequenceNo: 30,
            ZeroSelectable: "No",
            CategoryValues: [
                {
                    CVID: "CV1285858",
                    Label: "AWD",
                    SequenceNo: 10
                },
                {
                    CVID: "CV0394034",
                    Label: "Manual",
                    SequenceNo: 20
                }
            ]
        }
    ],
    Catalogs: [
        {
            
            FamilyId: "F011011001",
            Label: "Trim",
            SequenceNo: 10,
            SummaryDisplay: "Yes",
            CompareDisplay: "Yes",
            FeaturesDef: [
                {
                    FeatureId: "RNAYA",
                    Label: "Black Cloth Convertible Roof"
                },
                {
                    FeatureId: "RZZZ9",
                    Label: "RZZZ9"
                }
            ]
        },
        {
            FamilyId: "F011011002",
            Label: "Paint",
            SequenceNo: 20,
            SummaryDisplay: "No",
            CompareDisplay: "Yes",
            FeaturesDef: [
                {
                    FeatureId: "PN3AH",
                    Label: "Dark blue pearl metallic"
                },
                {
                    FeatureId: "PN3B1",
                    Label: "Pueblo Gold"
                }
            ]
        }
    ],
    DisplayFields: [
        {
            FieldId: "F100001",
            Label: "Brand",
            SequenceNo: 10
        },
        {
            FieldId: "F100002",
            Label: "Dealer Name",
            SequenceNo: 20
        },
        {
            FieldId: "F100003",
            Label: "VIN",
            SequenceNo: 21
        },
        {
            FieldId: "F100004",
            Label: "Vehicle Line",
            SequenceNo: 22
        }
    ]
};