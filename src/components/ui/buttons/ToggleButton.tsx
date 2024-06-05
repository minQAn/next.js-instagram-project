type Props = {
    toggled: boolean;
    onToggle: (toggled: boolean) => void;
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
    title: string;
};

export default function ToggleButton({ toggled, onToggle, onIcon, offIcon, title }: Props){
    return <button aria-label={title} onClick={() => onToggle(!toggled)}>
        {toggled? onIcon : offIcon}
    </button>;
}