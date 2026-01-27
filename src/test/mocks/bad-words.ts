let profane = false;

// Function to set the profane value for testing purposes
export const setProfane = (value: boolean) => {
  profane = value;
};

export class Filter {
  isProfane(_value: string): boolean {
    return profane;
  }
}
