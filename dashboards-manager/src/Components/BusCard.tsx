import { BusInfo } from "@/types";

interface BusCardProps {
  bus: BusInfo;
  onClick: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ bus, onClick }) => (
  <div onClick={onClick} className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow hover:bg-gray-50">
    <p><span className="font-semibold">Bus:</span> {bus.busNumber}</p>
    <p><span className="font-semibold">Driver:</span> {bus.basicInfo.driverName}</p>
    <p><span className="font-semibold">Route:</span> {bus.basicInfo.routeName}</p>
    <p><span className="font-semibold">Status:</span> {bus.basicInfo.busStatus}</p>
  </div>
);

export default BusCard;
