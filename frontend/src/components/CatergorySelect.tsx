import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const CategorySelect = () => {
  const values = [
    { value: "pollution", title: "Pollution" },
    { value: "Trash", title: "Trash" },
  ];
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup className="w-full">
          <SelectLabel>Category</SelectLabel>
          {values.map((val, index) => (
            <SelectItem key={index} value={val.value}>
              {val.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
