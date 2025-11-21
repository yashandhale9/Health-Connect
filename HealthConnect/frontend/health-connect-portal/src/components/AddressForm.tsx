import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFormProps {
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  onChange: (address: any) => void;
  errors?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export function AddressForm({ address, onChange, errors }: AddressFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-line1">Address Line 1</Label>
        <Input
          id="address-line1"
          value={address.line1}
          onChange={(e) => handleChange('line1', e.target.value)}
          placeholder="Street address"
        />
        {errors?.line1 && (
          <p className="text-sm text-destructive mt-1">{errors.line1}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
          {errors?.city && (
            <p className="text-sm text-destructive mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State"
          />
          {errors?.state && (
            <p className="text-sm text-destructive mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          value={address.pincode}
          onChange={(e) => handleChange('pincode', e.target.value)}
          placeholder="6-digit pincode"
          maxLength={6}
        />
        {errors?.pincode && (
          <p className="text-sm text-destructive mt-1">{errors.pincode}</p>
        )}
      </div>
    </div>
  );
}
