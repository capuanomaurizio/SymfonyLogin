<?php

namespace App\Document;

use App\Enum\FunctionalityRequirementType;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'requirements')]
class FunctionalityRequirement extends Requirement
{

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $requirementType;

    public function getRequirementType(): FunctionalityRequirementType
    {
        return FunctionalityRequirementType::from($this->requirementType);
    }

    public function setRequirementType(FunctionalityRequirementType $type): self
    {
        $this->requirementType = $type->value;
        return $this;
    }

}
