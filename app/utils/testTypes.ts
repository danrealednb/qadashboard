export const testTypeMapping = (testType: number) => {
	switch (testType) {
		case 1:
			return "Accessibility";
		case 2:
			return "Data Validation";
		case 3:
			return "E2E";
		case 4:
			return "Functional";
		case 5:
			return "Integration";
		case 6:
			return "Performance";
		case 7:
			return "Load";
		case 8:
			return "Regression";
		case 9:
			return "Security";
		case 10:
			return "Smoke";
		case 11:
			return "Unit";
		case 12:
			return "Non-Functional";
		case 13:
			return "Other";
		default:
			return "N/A"
	}
};