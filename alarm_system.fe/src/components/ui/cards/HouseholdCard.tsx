import * as React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Dot, Shield, Users } from "lucide-react";
import { Household } from "../../assets";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";

interface HouseholdCardProps {
  household: Household;
}

export const HouseholdCard: React.FC<HouseholdCardProps> = ({ household }) => {
  const alarmpositive = household.devices.some(
    (device) => device.alarm_triggered === 1 && device.active === true
  );

  return (
    <Link
      to={`/household-detail/${household._id}`}
      className="block transition-transform hover:scale-102"
    >
      <Card
        className={`overflow-hidden border-2 ${
          alarmpositive ? "border-red-500" : "border-gray-200"
        } bg-white shadow-sm hover:shadow-md`}
      >
        {alarmpositive && (
          <div className="bg-red-500 text-white text-xs font-medium py-1 px-3 text-center">
            Alarm triggered
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{household.name}</span>
            {alarmpositive && <AlertCircle className="h-5 w-5 text-red-500" />}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex items-center text-sm text-gray-600">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span>
              {household.devices.length}{" "}
              {household.devices.length === 1 ? "device" : "devices"}
            </span>
          </div>
          <Dot className="text-gray-400" />
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {household.members.length}{" "}
              {household.members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 text-sm text-gray-500 flex justify-center items-center py-2">
          <ArrowRight className="h-4 w-4 mr-1" /> View details
        </CardFooter>
      </Card>
    </Link>
  );
};
